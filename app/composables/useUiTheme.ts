import { contrastReport } from "#shared/utils/contrast";
import type { ContrastReportEntry } from "#shared/utils/contrast";
import {
  isUiThemeConfigured,
  resolvePageFrame,
  resolveScheme,
  themeFontsHref,
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
  const { frame: postFrame } = usePost();

  const theme = computed<UiTheme | null>(() =>
    isUiThemeConfigured(uiTheme.value) ? uiTheme.value : null,
  );

  const mode = computed<UiThemeMode>(
    () => theme.value?.mode || (siteConfig.value.site.theme as UiThemeMode),
  );

  const cssVars = computed(() =>
    theme.value ? themeToCssVars(theme.value) : "",
  );

  const fontsHref = computed(() => themeFontsHref(theme.value));

  // Каркас читают компоненты, а не только CSS: от `frame.hero` зависит, кто
  // рисует H1, а от `frame.sidebar` — рендерится ли колонка вообще.
  // `resolvePageFrame` берёт все четыре оси с поста — тема каркас не несёт.
  const frame = computed<UiFrame>(() => resolvePageFrame(postFrame.value));

  const contrast = computed<ContrastReportEntry[]>(() =>
    theme.value ? contrastReport(resolveScheme(theme.value)) : [],
  );

  // Пустая строка, а не имя дефолта: дефолт знает сам блок, и он у каждого
  // свой — `pickVariant` просто пропустит пустого кандидата дальше по цепочке
  // «запись → тема → дефолт блока».
  const variantFor = (key: keyof UiVariants): string =>
    theme.value?.variants?.[key] || "";

  // Оси каркаса и декора корень страницы получает атрибутами, а не
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
      "data-borders": value?.geometry?.borders,
      "data-shadow": value?.geometry?.shadow,
      "data-hero": frameValue.hero,
      "data-sidebar": frameValue.sidebar,
      "data-width": frameValue.width,
      "data-sticky": frameValue.sticky,
      "data-h2": value?.decor?.h2,
      // Ширина фона секций по умолчанию — читает PostSections.vue у секций
      // с mode "site" напрямую через useUiTheme().theme, а не через этот
      // атрибут; он здесь для той же CSS-развязки, что и остальные оси.
      "data-section-bg-width": value?.decor?.sectionBg?.token
        ? value.decor.sectionBg.width
        : undefined,
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
