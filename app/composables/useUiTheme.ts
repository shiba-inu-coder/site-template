import { seoConfig } from "@@/seo.conf";
import { contrastReport } from "#shared/utils/contrast";
import type { ContrastReportEntry } from "#shared/utils/contrast";
import {
  GOOGLE_FONT_WEIGHTS,
  googleFontsHref,
  isUiThemeConfigured,
  resolveScheme,
  themeToCssVars,
} from "#shared/utils/ui-theme";
import type { UiTheme, UiThemeMode, UiVariants } from "#shared/utils/ui-theme";

export const useUiTheme = () => {
  const { uiTheme, setUiTheme } = useSettings();

  const theme = computed<UiTheme | null>(() =>
    isUiThemeConfigured(uiTheme.value) ? uiTheme.value : null,
  );

  const mode = computed<UiThemeMode>(
    () => theme.value?.mode || (seoConfig.site.theme as UiThemeMode),
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

  const contrast = computed<ContrastReportEntry[]>(() =>
    theme.value ? contrastReport(resolveScheme(theme.value)) : [],
  );

  // Пустая строка, а не имя дефолта: дефолт знает сам блок, и он у каждого
  // свой — `pickVariant` просто пропустит пустого кандидата дальше по цепочке
  // «запись → тема → дефолт блока».
  const variantFor = (key: keyof UiVariants): string =>
    theme.value?.variants?.[key] || "";

  // Оси каркаса, декора и акцентов корень страницы получает атрибутами, а не
  // переменными: по ним 4e разводит вёрстку через `[data-*]`-селекторы.
  const frameAttrs = computed<Record<string, string>>(() => {
    const value = theme.value;

    if (!value) {
      return {};
    }

    const attrs: Record<string, unknown> = {
      "data-scale": value.type?.scale,
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

  return {
    theme,
    mode,
    cssVars,
    fontsHref,
    contrast,
    variantFor,
    frameAttrs,
    setTheme,
  };
};
