// node:test запускает этот файл напрямую через нативную поддержку TS в
// Node (без сборки) — `ui-theme.ts` тянет `#rc/utils/get-cloudinary-base-url`
// алиасом, которого вне Nuxt не существует, поэтому `imports` в package.json
// зеркалит его для голого Node.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  themeToCssVars,
  resolveScheme,
  DEFAULT_UI_THEME_DARK,
} from "../shared/utils/ui-theme.ts";

const withSectionBg = (sectionBg: { token: string; width: string }) => ({
  ...DEFAULT_UI_THEME_DARK,
  decor: { ...DEFAULT_UI_THEME_DARK.decor, sectionBg },
});

test("themeToCssVars: без decor.sectionBg своей переменной нет", () => {
  const css = themeToCssVars(DEFAULT_UI_THEME_DARK);

  assert.doesNotMatch(css, /--ui-section-bg/);
});

test("themeToCssVars: пустой token — то же самое, что фона нет", () => {
  const css = themeToCssVars(withSectionBg({ token: "", width: "container" }));

  assert.doesNotMatch(css, /--ui-section-bg/);
});

test("themeToCssVars: фон секций по умолчанию идёт через оттенок primary", () => {
  const css = themeToCssVars(
    withSectionBg({ token: "primary-200", width: "full" }),
  );

  assert.match(
    css,
    new RegExp(
      `--ui-section-bg: ${DEFAULT_UI_THEME_DARK.colors.primary[200]};`,
    ),
  );
});

const withHeaderBg = (headerBg: string, overrides: Record<string, string> = {}) => ({
  ...DEFAULT_UI_THEME_DARK,
  scheme: { ...DEFAULT_UI_THEME_DARK.scheme, "header-bg": headerBg, ...overrides },
});

test("header-text: auto даёт белый на тёмном header-bg", () => {
  const resolved = resolveScheme(withHeaderBg("#0f172a"));

  assert.equal(resolved["header-text"], "#ffffff");
});

test("header-text: auto даёт #0f172a на светлом header-bg", () => {
  const resolved = resolveScheme(withHeaderBg("#ffffff"));

  assert.equal(resolved["header-text"], "#0f172a");
});

test("header-text: явный primary-100 резолвится в свой цвет", () => {
  const theme = withHeaderBg("#0f172a", { "header-text": "primary-100" });
  const resolved = resolveScheme(theme);

  assert.equal(resolved["header-text"], theme.colors.primary[100]);
});
