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
  SCHEME_INHERIT,
  themeFontsHref,
  UI_TOKENS,
} from "../shared/utils/ui-theme.ts";
import type { UiTheme } from "../shared/utils/ui-theme.ts";

const withScheme = (scheme: Record<string, string>): UiTheme => ({
  ...DEFAULT_UI_THEME_DARK,
  scheme: scheme as UiTheme["scheme"],
});

test("themeToCssVars: в записи нет ни --ui-section-bg, ни тени", () => {
  const css = themeToCssVars({
    ...DEFAULT_UI_THEME_DARK,
    decor: { firstSection: { mode: "color" } },
  });

  assert.doesNotMatch(css, /--ui-section-bg|shadow/);
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
  assert.equal(resolved.text, "#0f172a");
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

test("resolveScheme: новые ключи без записи наследуют старые, а не дефолт", () => {
  const resolved = resolveScheme(
    withScheme({
      text: "#112233",
      "cta-bg": "#aa0000",
      "cta-hover": "#bb0000",
      "cta-text": "#eeeeee",
    }),
  );

  assert.equal(resolved["header-text"], "#112233");
  assert.equal(resolved["footer-text"], "#112233");
  assert.equal(resolved["table-btn-bg"], "#aa0000");
  assert.equal(resolved["table-btn-hover"], "#bb0000");
  assert.equal(resolved["table-btn-text"], "#eeeeee");
});

test("resolveScheme: «auto» из старой записи — отсутствие, шапка берёт text", () => {
  const resolved = resolveScheme(
    withScheme({ text: "#112233", "header-text": "auto" }),
  );

  assert.equal(resolved["header-text"], "#112233");
});

test("resolveScheme: явное значение нового ключа важнее наследования", () => {
  const resolved = resolveScheme(
    withScheme({ text: "#112233", "footer-text": "#445566" }),
  );

  assert.equal(resolved["footer-text"], "#445566");
  assert.equal(resolved["header-text"], "#112233");
});

test("resolveScheme: ссылка на оттенок, которого в теме нет, — отсутствие", () => {
  const resolved = resolveScheme(
    withScheme({ text: "#112233", "footer-text": "primary-999" }),
  );

  assert.equal(resolved["footer-text"], "#112233");
});

test("resolveScheme: старый surface-* резолвится по режиму темы", () => {
  const scheme = {
    text: "surface-text",
    "cta-text": "surface-on-brand",
    "table-head-text": "surface-muted",
  };
  const dark = resolveScheme(withScheme(scheme));
  const light = resolveScheme({ ...withScheme(scheme), mode: "light" });

  assert.equal(dark.text, "#ffffff");
  assert.equal(dark["cta-text"], "#0f172a");
  assert.equal(dark["header-text"], "#ffffff");
  assert.equal(light.text, "#0f172a");
  assert.equal(light["cta-text"], "#ffffff");
  assert.equal(light["table-head-text"], "#475569");
});

test("SCHEME_INHERIT: каждый ключ и его родитель — токены схемы", () => {
  for (const [token, parent] of Object.entries(SCHEME_INHERIT)) {
    assert.ok((UI_TOKENS as readonly string[]).includes(token), token);
    assert.ok((UI_TOKENS as readonly string[]).includes(parent), parent);
  }
});

const withGeometry = (geometry: Record<string, unknown>) =>
  ({
    ...DEFAULT_UI_THEME_DARK,
    geometry: { ...DEFAULT_UI_THEME_DARK.geometry, ...geometry },
  }) as UiTheme;

test("рамки: borderWidth уходит переменной в px, rem и em", () => {
  for (const width of ["0", "1px", "2.5px", "0.1rem", ".2em"]) {
    assert.match(
      themeToCssVars(withGeometry({ borderWidth: width })),
      new RegExp(`--ui-border-width: ${width.replace(".", "\\.")};`),
      width,
    );
  }
});

test("рамки: старое borders 0/1/2 даёт 0/1px/2px, borderWidth главнее", () => {
  assert.match(
    themeToCssVars(withGeometry({ borders: 2 })),
    /--ui-border-width: 2px;/,
  );
  assert.match(
    themeToCssVars(withGeometry({ borders: 1 })),
    /--ui-border-width: 1px;/,
  );
  assert.match(
    themeToCssVars(withGeometry({ borders: 0 })),
    /--ui-border-width: 0;/,
  );
  assert.match(
    themeToCssVars(withGeometry({ borders: 2, borderWidth: "3px" })),
    /--ui-border-width: 3px;/,
  );
});

test("рамки: мусор не пишется, запись без рамок — тоже", () => {
  for (const geometry of [
    {},
    { borderWidth: "thick" },
    { borderWidth: "-1px" },
    { borderWidth: "2px;}body{x:y" },
    { borderWidth: "5" },
    { borders: 7 },
    { borders: null },
  ]) {
    assert.doesNotMatch(
      themeToCssVars(withGeometry(geometry)),
      /--ui-border-width/,
      JSON.stringify(geometry),
    );
  }
});

const withBodyWeight = (weight: unknown) =>
  ({
    ...DEFAULT_UI_THEME_DARK,
    type: {
      display: { family: "Raleway" },
      body: { family: "Raleway", weight },
    },
  }) as UiTheme;

test("жирность текста: --font-body-weight только при заданном весе", () => {
  assert.match(themeToCssVars(withBodyWeight(300)), /--font-body-weight: 300;/);
  assert.doesNotMatch(
    themeToCssVars(DEFAULT_UI_THEME_DARK),
    /--font-body-weight/,
  );

  for (const junk of [0, 50, 1000, 400.5, "bold", null]) {
    assert.doesNotMatch(
      themeToCssVars(withBodyWeight(junk)),
      /--font-body-weight/,
      String(junk),
    );
  }
});

test("жирность текста: вес попадает в адрес шрифта", () => {
  assert.match(themeFontsHref(withBodyWeight(300)), /wght@300;400;500;700/);
  assert.doesNotMatch(themeFontsHref(withBodyWeight(null)), /300/);
});
