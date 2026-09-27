// Тот же набор прогоняет панель (appspro): она строит тему для превью и
// сохранения теми же функциями, что сайт для страницы. Разойдутся — оператор
// увидит в превью одно, а сайт покажет другое.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  googleFontsHref,
  normalizeFontFamily,
  resolveRadius,
  themeToCssVars,
} from "../shared/utils/ui-theme.ts";
import type { UiTheme } from "../shared/utils/ui-theme.ts";
import { hexToRgb } from "../shared/utils/contrast.ts";

const cases = JSON.parse(
  readFileSync(
    new URL("./fixtures/theme-parity.json", import.meta.url),
    "utf8",
  ),
);

test("паритет: имя шрифта", () => {
  for (const { input, name } of cases.fontFamily) {
    assert.equal(normalizeFontFamily(input), name, JSON.stringify(input));
  }
});

test("паритет: радиус", () => {
  for (const { input, output } of cases.radius) {
    assert.equal(resolveRadius(input), output, input);
  }
});

test("паритет: hex в RGB", () => {
  for (const { input, rgb } of cases.hex) {
    assert.deepEqual(hexToRgb(input), rgb, input);
  }
});

test("паритет: ссылка на Google Fonts", () => {
  for (const { input, weights, output } of cases.fontsHref) {
    assert.equal(googleFontsHref(input, weights), output, input.join(" | "));
  }
});

test("паритет: переменные темы целиком", () => {
  for (const { theme, output } of cases.cssVars) {
    assert.equal(themeToCssVars(theme as UiTheme), output, theme.templateName);
  }
});
