import { isUiThemeConfigured, themeFontsHref } from "./ui-theme.ts";
import type { UiTheme } from "./ui-theme.ts";

/**
 * Тема из `brand/theme.json` заменяет `settings.uiTheme` целиком — смешивать
 * две темы по полям значило бы показать ни ту, ни другую. Недонастроенный
 * `theme.json` не считается: сайт остаётся на теме из базы.
 */
export const pickUiTheme = (
  brandTheme: UiTheme | null | undefined,
  settingsTheme: UiTheme | null | undefined,
): UiTheme | null | undefined =>
  isUiThemeConfigured(brandTheme) ? brandTheme : settingsTheme;

// Сервер встраивает @font-face по этому адресу, страница сверяет с ним свой
// (`useUiTheme`). Тема для обоих выбирается одинаково, иначе шрифт бренда
// уходил бы ссылкой на Google.
export const siteThemeFontsHref = (
  brandTheme: UiTheme | null | undefined,
  settingsTheme: UiTheme | null | undefined,
): string => themeFontsHref(pickUiTheme(brandTheme, settingsTheme));
