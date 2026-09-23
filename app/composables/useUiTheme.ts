import { contrastReport } from "#shared/utils/contrast";
import type { ContrastReportEntry } from "#shared/utils/contrast";
import {
  GOOGLE_FONT_WEIGHTS,
  googleFontsHref,
  isUiThemeConfigured,
  resolvePageFrame,
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
  const runtimeConfig = useRuntimeConfig();
  const { frame: postFrame } = usePost();

  const theme = computed<UiTheme | null>(() =>
    isUiThemeConfigured(uiTheme.value) ? uiTheme.value : null,
  );

  const mode = computed<UiThemeMode>(
    () => theme.value?.mode || (siteConfig.value.site.theme as UiThemeMode),
  );

  const cssVars = computed(() =>
    theme.value
      ? themeToCssVars(
          theme.value,
          runtimeConfig.public.CLOUDINARY_CLOUD_NAME as string,
        )
      : "",
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
  // `resolvePageFrame` берёт `hero`/`sidebar`/`width`/`sticky` с поста, а
  // `heroStyle`/`headerInverted`/`bands` — из темы.
  const frame = computed<UiFrame>(() =>
    resolvePageFrame(theme.value, postFrame.value),
  );

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
  // без атрибута сайт рисует свой дефолт, а не пустое значение. Каркас
  // (`data-hero`, `data-sidebar`, `data-width`, `data-sticky`) идёт из
  // `frame.value`, а не из `theme.value` напрямую — с поста он есть и без
  // настроенной темы.
  const frameAttrs = computed<Record<string, string>>(() => {
    const value = theme.value;
    const frameValue = frame.value;

    const attrs: Record<string, unknown> = {
      "data-scale": value?.type?.scale,
      "data-h1": value?.type?.h1Align,
      "data-borders": value?.geometry?.borders,
      "data-shadow": value?.geometry?.shadow,
      "data-density": value?.geometry?.density,
      "data-header-inverted": frameValue.headerInverted,
      "data-hero": frameValue.hero,
      "data-hero-style": frameValue.heroStyle,
      "data-sidebar": frameValue.sidebar,
      "data-bands": frameValue.bands,
      "data-width": frameValue.width,
      "data-sticky": frameValue.sticky,
      "data-h2": value?.decor?.h2,
      "data-bg": value?.decor?.bg,
      "data-bg-image": value?.decor?.bgImage?.path ? "1" : undefined,
      "data-img": value?.decor?.img,
      "data-btn": value?.decor?.btn?.join(" "),
      "data-badge": value?.accents?.badge,
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
  };
};
