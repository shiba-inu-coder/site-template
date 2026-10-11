// node:test запускает этот файл напрямую через нативную поддержку TS в
// Node (без сборки) — `ui-theme.ts` тянет `#rc/utils/get-cloudinary-base-url`
// алиасом, которого вне Nuxt не существует, поэтому `imports` в package.json
// зеркалит его для голого Node.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  themeToCssVars,
  resolveScheme,
  googleFontsHref,
  DEFAULT_UI_THEME_DARK,
  UI_TOKENS,
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

test("resolveScheme: старая схема с удалёнными ключами резолвится без них", () => {
  const resolved = resolveScheme({
    ...DEFAULT_UI_THEME_DARK,
    scheme: {
      ...DEFAULT_UI_THEME_DARK.scheme,
      "header-text": "auto",
      muted: "surface-muted",
      "badge-bg": "accent-200",
      "accent-soft": "accent-100",
    } as typeof DEFAULT_UI_THEME_DARK.scheme,
  });

  assert.deepEqual(Object.keys(resolved), [...UI_TOKENS]);
  assert.equal(resolved.text, "#ffffff");
});

test("resolveScheme: h2-decor без записи наследует marker, а не дефолт", () => {
  const { "h2-decor": _decor, ...withoutDecor } = DEFAULT_UI_THEME_DARK.scheme;
  const resolved = resolveScheme({
    ...DEFAULT_UI_THEME_DARK,
    scheme: {
      ...withoutDecor,
      marker: "#ff0000",
    } as typeof DEFAULT_UI_THEME_DARK.scheme,
  });

  assert.equal(resolved["h2-decor"], "#ff0000");
});

test("resolveScheme: явный h2-decor важнее marker", () => {
  const resolved = resolveScheme({
    ...DEFAULT_UI_THEME_DARK,
    scheme: {
      ...DEFAULT_UI_THEME_DARK.scheme,
      marker: "#ff0000",
      "h2-decor": "#00ff00",
    },
  });

  assert.equal(resolved["h2-decor"], "#00ff00");
});

test("resolveScheme: без marker и h2-decor декор берёт дефолт", () => {
  const resolved = resolveScheme({
    ...DEFAULT_UI_THEME_DARK,
    scheme: {} as typeof DEFAULT_UI_THEME_DARK.scheme,
  });

  assert.equal(resolved["h2-decor"], DEFAULT_UI_THEME_DARK.colors.accent[200]);
});

const withFonts = (body: string, display = body) => ({
  ...DEFAULT_UI_THEME_DARK,
  type: { display: { family: display }, body: { family: body } },
});

test("шрифт: голое имя, CSS-значение из базы и имя с цифрой дают семейство в кавычках с фолбэком", () => {
  for (const [input, name] of [
    ["Raleway", "Raleway"],
    ['"Raleway", sans-serif', "Raleway"],
    ["Source Sans 3", "Source Sans 3"],
  ]) {
    const css = themeToCssVars(withFonts(input));

    assert.match(css, new RegExp(`--font-primary: "${name}", sans-serif;`));
    assert.match(css, new RegExp(`--font-heading: "${name}", sans-serif;`));
  }
});

test("шрифт: одно семейство, записанное в базе по-разному, — одно family= в ссылке", () => {
  const href = googleFontsHref(['"Raleway", sans-serif', "Raleway"]);

  assert.equal(href.match(/family=/g)?.length, 1);
  assert.match(href, /family=Raleway:wght@/);
});

test("шрифт: строка с `;}` не даёт строки ни в CSS, ни ссылки на Google Fonts", () => {
  const css = themeToCssVars(withFonts("Inter;}body{color:red"));

  assert.doesNotMatch(css, /--font-(primary|heading):/);
  assert.equal(googleFontsHref("Inter;}body{color:red"), "");
});

const withRadius = (radius: string) => ({
  ...DEFAULT_UI_THEME_DARK,
  geometry: { ...DEFAULT_UI_THEME_DARK.geometry, radius },
});

test("радиус: токен шкалы уходит литералом, процент остаётся как есть", () => {
  assert.match(
    themeToCssVars(withRadius("var(--radius-xl)")),
    /--radius-primary: 0\.75rem;/,
  );
  assert.match(themeToCssVars(withRadius("50%")), /--radius-primary: 50%;/);
});

test("радиус: неизвестный токен, отрицательный и нечисловой — строки нет", () => {
  for (const radius of ["var(--radius-5xl)", "-4px", "abc"]) {
    assert.doesNotMatch(
      themeToCssVars(withRadius(radius)),
      /--radius-primary/,
      radius,
    );
  }
});
