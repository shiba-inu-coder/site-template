import { contrastReport } from "#shared/utils/contrast";
import type { ContrastReportEntry } from "#shared/utils/contrast";
import {
  GOOGLE_FONT_WEIGHTS,
  googleFontsHref,
  isUiThemeConfigured,
  resolveScheme,
  themeToCssVars,
} from "#shared/utils/ui-theme";
import type {
  UiFrame,
  UiTheme,
  UiThemeMode,
  UiVariants,
} from "#shared/utils/ui-theme";

export const useUiTheme = () => {
  const { uiTheme, setUiTheme } = useSettings();
  const siteConfig = useSiteConfig();

  const theme = computed<UiTheme | null>(() =>
    isUiThemeConfigured(uiTheme.value) ? uiTheme.value : null,
  );

  const mode = computed<UiThemeMode>(
    () => theme.value?.mode || (siteConfig.value.site.theme as UiThemeMode),
  );

  const cssVars = computed(() =>
    theme.value ? themeToCssVars(theme.value) : "",
  );

  const fontsHref = computed(() => {
    const type = theme.value?.type;
    const families = [type?.body?.family, type?.display?.family].filter(
      Boolean,
    ) as string[];

    if (!families.length) {
      return "";
    }

    const weights = type?.display?.weight
      ? [...GOOGLE_FONT_WEIGHTS, type.display.weight]
      : GOOGLE_FONT_WEIGHTS;

    return googleFontsHref(families, weights);
  });

  // Каркас читают компоненты, а не только CSS: от `frame.hero` зависит, кто
  // рисует H1, а от `frame.sidebar` — рендерится ли колонка вообще.
  const frame = computed<UiFrame>(() => theme.value?.frame ?? {});

  const contrast = computed<ContrastReportEntry[]>(() =>
    theme.value ? contrastReport(resolveScheme(theme.value)) : [],
  );

  // Пустая строка, а не имя дефолта: дефолт знает сам блок, и он у каждого
  // свой — `pickVariant` просто пропустит пустого кандидата дальше по цепочке
  // «запись → тема → дефолт блока».
  const variantFor = (key: keyof UiVariants): string =>
    theme.value?.variants?.[key] || "";

  // Оси каркаса, декора и акцентов корень страницы получает атрибутами, а не
  // переменными: по ним блок `/* UI axes */` в `tailwind.css` разводит вёрстку
  // через `[data-*]`-селекторы. Оси, которой в записи нет, нет и в атрибутах —
  // без атрибута сайт рисует свой дефолт, а не пустое значение.
  const frameAttrs = computed<Record<string, string>>(() => {
    const value = theme.value;

    if (!value) {
      return {};
    }

    const attrs: Record<string, unknown> = {
      "data-scale": value.type?.scale,
      "data-h1": value.type?.h1Align,
      "data-borders": value.geometry?.borders,
      "data-shadow": value.geometry?.shadow,
      "data-density": value.geometry?.density,
      "data-header": value.frame?.header,
      "data-header-inverted": value.frame?.headerInverted,
      "data-hero": value.frame?.hero,
      "data-hero-style": value.frame?.heroStyle,
      "data-sidebar": value.frame?.sidebar,
      "data-bands": value.frame?.bands,
      "data-width": value.frame?.width,
      "data-sticky": value.frame?.sticky,
      "data-h2": value.decor?.h2,
      "data-bg": value.decor?.bg,
      "data-img": value.decor?.img,
      "data-btn": value.decor?.btn?.join(" "),
      "data-badge": value.accents?.badge,
      "data-big": value.accents?.big,
    };

    return Object.fromEntries(
      Object.entries(attrs)
        .filter(
          ([, item]) => item !== undefined && item !== null && item !== "",
        )
        .map(([name, item]) => [name, String(item)]),
    );
  });

  const setTheme = (next: UiTheme | null) => {
    setUiTheme(isUiThemeConfigured(next) ? next : null);
  };

  // Превью-мост с панелью (5b): `?preview=` в адресе — то же самое условие,
  // на котором уже стоит слушатель `ui-theme` в плагине, здесь оно нужно и
  // для отправки. Без него сообщения ушли бы с обычной боевой страницы.
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();

  const isPreview = computed(() => Boolean(route.query.preview));

  const panelOrigins = computed(() =>
    String(runtimeConfig.public.PANEL_ORIGINS || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  );

  const notifyPanel = (message: Record<string, unknown>) => {
    if (import.meta.server || !isPreview.value) {
      return;
    }

    const target = window.parent !== window ? window.parent : window.opener;

    if (!target) {
      return;
    }

    for (const origin of panelOrigins.value) {
      target.postMessage(message, origin);
    }
  };

  // Живо ли соединение с панелью — панель отвечает `ui-attach` на `ui-ready`
  // (плагин ставит `true` при получении). Панелька выбора варианта проверяет
  // это, чтобы не рисовать себя на голом `?preview=` без панели за ним.
  const previewAttached = useState<boolean>("ui-preview-attached", () => false);

  const markPreviewAttached = () => {
    previewAttached.value = true;
  };

  // Панелька выбора варианта (5b): применяет вариант локально поверх текущей
  // темы и уведомляет панель — та сама решает, `variants.<key>` это или
  // `frame.<key>`, и присылает обратно полную тему. Без темы применять
  // некуда: без неё сайт рисует дефолт образа, а не запись, которую можно
  // патчить точечно.
  const setVariant = (
    group: "variants" | "frame",
    key: string,
    value: string,
  ) => {
    const current = theme.value;

    // Локально патчить нечего без темы — но панель узнаёт о клике в любом
    // случае: это она решает, `variants.<key>` это или `frame.<key>`, и может
    // прислать первую тему сайта в ответ на самый первый клик.
    if (current) {
      setTheme({
        ...current,
        [group]: { ...current[group], [key]: value },
      });
    }

    notifyPanel({ type: "ui-variant", key, value });
  };

  return {
    theme,
    mode,
    cssVars,
    fontsHref,
    contrast,
    variantFor,
    frame,
    frameAttrs,
    setTheme,
    isPreview,
    panelOrigins,
    notifyPanel,
    previewAttached,
    markPreviewAttached,
    setVariant,
  };
};
