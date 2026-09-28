// Без импортов: модуль гоняет голый `node --test`, где нет ни Nitro, ни
// алиасов.

export const THEME_FONTS_PREFIX = "/_theme-fonts/";

const GSTATIC_ORIGIN = "https://fonts.gstatic.com/";

// Все файлы, которые css2 отдаёт современному Chrome, лежат как
// `s/<семейство>/v<версия>/<имя>.woff2`. CJK-семейства режутся на сотни
// кусков, и номер куска стоит перед расширением: `<имя>.12.woff2`.
const THEME_FONT_PATH = /^s\/[a-z0-9]+\/v\d+\/[A-Za-z0-9_-]+(?:\.\d+)?\.woff2$/;

export const isThemeFontPath = (path: unknown): path is string =>
  typeof path === "string" && THEME_FONT_PATH.test(path);

export type ThemeFonts = {
  css: string;
  href: string;
};

const FONT_FACE_BLOCK = /@font-face\s*\{[^}]*\}/g;
const CSS_URL = /url\(\s*(['"]?)([^'")]*)\1\s*\)/gi;
const NON_LOCAL_URL = /url\((?!\/_theme-fonts\/)/i;

const localFontUrl = (url: string): string => {
  const path = url.startsWith(GSTATIC_ORIGIN)
    ? url.slice(GSTATIC_ORIGIN.length)
    : url.startsWith(THEME_FONTS_PREFIX)
      ? url.slice(THEME_FONTS_PREFIX.length)
      : "";

  return isThemeFontPath(path) ? `${THEME_FONTS_PREFIX}${path}` : "";
};

// CSS встаёт в страницу как есть, поэтому наружу проходит только @font-face,
// у которого каждый url() ведёт на файл Google Fonts, — чужой адрес вернул бы
// браузеру запрос на сторону. Блок с обратным слешем отбрасывается тоже:
// экранированное `\75 rl(` для браузера тот же url(), а регулярка его не
// видит. Всё вне блоков (комментарии подмножеств) не нужно странице.
export const rewriteFontFaceUrls = (css: string): string =>
  (css.match(FONT_FACE_BLOCK) ?? [])
    .map((block) => {
      if (block.includes("\\")) {
        return "";
      }

      let foreign = false;
      const rewritten = block.replace(CSS_URL, (_match, _quote, url) => {
        const local = localFontUrl(url);

        foreign ||= !local;

        return `url(${local})`;
      });

      return foreign || NON_LOCAL_URL.test(rewritten) ? "" : rewritten;
    })
    .filter(Boolean)
    .join("\n");

// Заголовок WOFF2: сигнатура `wOF2`, по смещению 8 — длина файла целиком.
// Сверка длины ловит файл, прочитанный с диска, пока соседний запрос его ещё
// пишет: такой обрубок ушёл бы браузеру и nginx с `immutable` на год.
export const isCompleteWoff2 = (bytes: Uint8Array): boolean =>
  bytes.byteLength >= 12 &&
  bytes[0] === 0x77 &&
  bytes[1] === 0x4f &&
  bytes[2] === 0x46 &&
  bytes[3] === 0x32 &&
  new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(
    8,
  ) === bytes.byteLength;
