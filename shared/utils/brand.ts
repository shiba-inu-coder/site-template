import { isUiThemeConfigured } from "./ui-theme.ts";
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
