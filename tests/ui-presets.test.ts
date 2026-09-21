// node:test запускает этот файл напрямую через нативную поддержку TS в
// Node — `ui-presets.ts` тянет `#shared/utils/ui-theme` алиасом, которого
// вне Nuxt не существует, поэтому `imports` в package.json зеркалит его для
// голого Node (тот же приём, что уже есть для `#rc/...` в ui-theme.test.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { UI_PRESETS, findUiPreset } from "../shared/constants/ui-presets.ts";
import { resolveScheme } from "../shared/utils/ui-theme.ts";
import { contrastRatio, CONTRAST_PAIRS } from "../shared/utils/contrast.ts";

const REQUIRED_PAIRS = CONTRAST_PAIRS.filter((pair) => pair.required);

test("UI_PRESETS: единственный пресет — blank", () => {
  assert.deepEqual(
    UI_PRESETS.map((preset) => preset.templateId),
    ["blank"],
  );
});

test("findUiPreset: каждый id из UI_PRESETS находится и совпадает по ссылке", () => {
  for (const preset of UI_PRESETS) {
    assert.equal(findUiPreset(preset.templateId), preset);
  }
});

// Гейт пресета (см. `shared/utils/contrast.ts`): семь обязательных пар не
// опускаются ниже WCAG AA (4.5) — у шаблона больше нет страницы, где это
// проверяют глазами.
test("контраст: все обязательные пары ≥ 4.5 на каждом пресете", () => {
  const failures: string[] = [];

  for (const preset of UI_PRESETS) {
    const resolved = resolveScheme(preset);

    for (const pair of REQUIRED_PAIRS) {
      const ratio = contrastRatio(resolved[pair.fg], resolved[pair.bg]);
      if (ratio < 4.5) {
        failures.push(`${preset.templateId}: ${pair.id} = ${ratio.toFixed(2)}`);
      }
    }
  }

  assert.deepEqual(failures, []);
});
