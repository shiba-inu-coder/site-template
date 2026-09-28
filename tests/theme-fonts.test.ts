import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isCompleteWoff2,
  isThemeFontPath,
  rewriteFontFaceUrls,
} from "../shared/utils/theme-fonts.ts";
import {
  DEFAULT_UI_THEME_DARK,
  themeFontsHref,
} from "../shared/utils/ui-theme.ts";

const FONT_PATH =
  "s/sourcesans3/v19/nwpBtKy2OAdR1K-IwhWudF-R9QMylBJAV3Bo8Kw461EN.woff2";

const fontFace = (src: string, unicodeRange = "U+0000-00FF, U+0131") =>
  `@font-face {
  font-family: 'Source Sans 3';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: ${src} format('woff2');
  unicode-range: ${unicodeRange};
}`;

test("шрифты темы: адрес gstatic становится своим, остальное в блоке не трогается", () => {
  const css = rewriteFontFaceUrls(
    `/* latin */\n${fontFace(`url(https://fonts.gstatic.com/${FONT_PATH})`)}`,
  );

  assert.equal(css, fontFace(`url(/_theme-fonts/${FONT_PATH})`));
  assert.match(css, /font-display: swap;/);
  assert.match(css, /unicode-range: U\+0000-00FF, U\+0131;/);
  assert.doesNotMatch(css, /latin \*\//);
});

test("шрифты темы: блок с чужим url() выпадает целиком, соседний остаётся", () => {
  const css = rewriteFontFaceUrls(
    [
      fontFace(`url(https://fonts.gstatic.com/${FONT_PATH})`),
      fontFace(
        `url(https://fonts.gstatic.com/${FONT_PATH}) format('woff2'), url(https://evil.example/a.woff2)`,
      ),
      fontFace(`url("https://evil.example/${FONT_PATH}")`),
      fontFace(`URL(https://fonts.gstatic.com/l/font?kit=abc)`),
      fontFace(`\\75 rl(https://evil.example/a.woff2)`),
    ].join("\n"),
  );

  assert.equal(css, fontFace(`url(/_theme-fonts/${FONT_PATH})`));
  assert.doesNotMatch(css, /evil|gstatic/);
});

test("шрифты темы: кавычки вокруг адреса и регистр url() не мешают переписать", () => {
  assert.equal(
    rewriteFontFaceUrls(
      fontFace(`URL('https://fonts.gstatic.com/${FONT_PATH}')`),
    ),
    fontFace(`url(/_theme-fonts/${FONT_PATH})`),
  );
});

test("шрифты темы: повторный проход ничего не меняет, пустой вход — пустой выход", () => {
  const once = rewriteFontFaceUrls(
    [
      fontFace(`url(https://fonts.gstatic.com/${FONT_PATH})`),
      fontFace(
        "url(https://fonts.gstatic.com/s/notosansjp/v56/-F62fjtqLzI2JPCgQBnw7HFow.12.woff2)",
        "U+3000-303F",
      ),
    ].join("\n"),
  );

  assert.equal(once.match(/@font-face/g)?.length, 2);
  assert.equal(rewriteFontFaceUrls(once), once);
  assert.equal(rewriteFontFaceUrls(""), "");
  assert.equal(rewriteFontFaceUrls("/* latin */"), "");
});

test("шрифты темы: путь файла — только форма, которую отдаёт gstatic", () => {
  assert.equal(isThemeFontPath(FONT_PATH), true);
  assert.equal(
    isThemeFontPath("s/notosansjp/v56/-F62fjtqLzI2JPCgQBnw7HFow.0.woff2"),
    true,
  );

  for (const path of [
    "",
    undefined,
    `/${FONT_PATH}`,
    `https://fonts.gstatic.com/${FONT_PATH}`,
    "s/../v1/a.woff2",
    "s/x/v1/../../etc/passwd.woff2",
    "s/x/v1/a.ttf",
    "s/x/v1/a.woff2?x=1",
    "s/Source/v1/a.woff2",
    "l/font?kit=abc",
  ]) {
    assert.equal(isThemeFontPath(path), false, String(path));
  }
});

const woff2 = (length: number, declared = length) => {
  const bytes = new Uint8Array(length);

  bytes.set([0x77, 0x4f, 0x46, 0x32]);
  new DataView(bytes.buffer).setUint32(8, declared);

  return bytes;
};

test("шрифты темы: файл засчитывается целым, только когда длина совпала с заголовком", () => {
  assert.equal(isCompleteWoff2(woff2(64)), true);
  assert.equal(isCompleteWoff2(woff2(64, 128)), false);
  assert.equal(isCompleteWoff2(woff2(64).subarray(0, 40)), false);
  assert.equal(
    isCompleteWoff2(new TextEncoder().encode("<html>404</html>")),
    false,
  );
  assert.equal(isCompleteWoff2(new Uint8Array()), false);
});

test("шрифты темы: из буфера со смещением длина читается по его собственному началу", () => {
  const pool = new Uint8Array(96);

  pool.set(woff2(64), 16);

  assert.equal(isCompleteWoff2(pool.subarray(16, 80)), true);
});

const withType = (type: Record<string, unknown>) => ({
  ...DEFAULT_UI_THEME_DARK,
  type,
});

test("шрифты темы: одно семейство в обеих ролях — один family=, вес заголовка добавлен", () => {
  const href = themeFontsHref(
    withType({
      body: { family: "Raleway" },
      display: { family: '"Raleway", sans-serif', weight: 800 },
    }) as never,
  );

  assert.equal(
    href,
    "https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;700;800&display=swap",
  );
});

test("шрифты темы: без настроенной темы или без семейств адреса нет", () => {
  assert.equal(themeFontsHref(null), "");
  assert.equal(themeFontsHref(undefined), "");
  assert.equal(
    themeFontsHref({ ...DEFAULT_UI_THEME_DARK, colors: undefined } as never),
    "",
  );
  assert.equal(themeFontsHref(withType({}) as never), "");
  assert.equal(themeFontsHref(withType(undefined as never) as never), "");
});
