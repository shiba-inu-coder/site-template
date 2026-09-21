import type { UiTheme } from "#shared/utils/ui-theme";
import { DEFAULT_UI_THEME_LIGHT } from "#shared/utils/ui-theme";

// Единственный пресет: семейства (были 5, до них 14) убраны — оператор красит
// сайт вручную в редакторе, готовые темы больше не нужны. `findUiPreset("blank")`
// подставляет тот же нейтральный дефолт, что и сайт без темы вовсе
// (`DEFAULT_UI_THEME_LIGHT` — светлый, а не тёмный: `TEMPLATE_DEFAULT_COLORS`
// сама по себе светлая, и только светлый `mode` даёт тёмный текст на ней —
// тёмный `mode` в паре с этими цветами не проходит гейт контраста).
export const UI_PRESETS: UiTheme[] = [
  {
    ...DEFAULT_UI_THEME_LIGHT,
    templateId: "blank",
    templateName: "Пустой",
    updatedAt: new Date("2026-09-21T00:00:00.000Z"),
  },
];

export const findUiPreset = (templateId: string): UiTheme | null =>
  UI_PRESETS.find((preset) => preset.templateId === templateId) || null;
