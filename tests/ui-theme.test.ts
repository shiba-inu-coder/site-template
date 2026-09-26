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
import type { SectionBgToken } from "../shared/utils/ui-theme.ts";

const withSectionBg = (sectionBg: {
  token: SectionBgToken;
  width: "container" | "full";
}) => ({
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

test("themeToCssVars: девять цветов бренда пишутся своими переменными", () => {
  const css = themeToCssVars({
    ...DEFAULT_UI_THEME_DARK,
    colors: {
      primary: { 300: "#0e0f20", 200: "#1a1c33", 100: "#2b2e4a" },
      active: { 300: "#b8860b", 200: "#daa520", 100: "#f0c75e" },
      accent: { 300: "#8b0000", 200: "#b22222", 100: "#dc5c5c" },
    },
  });

  assert.match(css, /--color-primary-300: #0e0f20;/);
  assert.match(css, /--color-primary-200: #1a1c33;/);
  assert.match(css, /--color-active-200: #daa520;/);
  assert.match(css, /--color-accent-100: #dc5c5c;/);
});

test("themeToCssVars: без цветов своих переменных бренда нет — остаются из :root образа", () => {
  const css = themeToCssVars({
    ...DEFAULT_UI_THEME_DARK,
    colors: {} as typeof DEFAULT_UI_THEME_DARK.colors,
  });

  assert.doesNotMatch(css, /--color-(primary|active|accent)-/);
});

const withHeaderBg = (
  headerBg: string,
  overrides: Record<string, string> = {},
) => ({
  ...DEFAULT_UI_THEME_DARK,
  scheme: {
    ...DEFAULT_UI_THEME_DARK.scheme,
    "header-bg": headerBg,
    ...overrides,
  },
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
