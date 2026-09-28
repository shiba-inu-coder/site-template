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

// Строка `server/lib/font-metrics.json`: категория, unitsPerEm, ascent,
// descent, lineGap и средняя ширина латиницы по весам.
export type FontMetricsRow = [
  string,
  number,
  number,
  number,
  number,
  Record<string, number>,
];

export type FontFallback = {
  css: string;
  stacks: Record<string, string>;
};

export type ThemeFontsResponse = ThemeFonts & { fallback: FontFallback };

type LocalFont = {
  name: string;
  generic: string;
  regular: string[];
  bold: string[];
};

// size-adjust считается против ширины одного шрифта, поэтому в `src` стоят
// только его метрические двойники: Liberation и Croscore повторяют ширины
// Arial/Times/Courier один в один. Шрифт с другими ширинами в тот же `src`
// дописывать нельзя — подгонка разъедется у всех, у кого найдётся он.
const SANS: LocalFont = {
  name: "Arial",
  generic: "sans-serif",
  regular: ["Arial", "ArialMT", "Liberation Sans", "Arimo"],
  bold: ["Arial Bold", "Arial-BoldMT", "Liberation Sans Bold", "Arimo Bold"],
};

const LOCAL_BY_CATEGORY = new Map<string, LocalFont>([
  ["sans-serif", SANS],
  ["display", SANS],
  ["handwriting", SANS],
  [
    "serif",
    {
      name: "Times New Roman",
      generic: "serif",
      regular: [
        "Times New Roman",
        "TimesNewRomanPSMT",
        "Liberation Serif",
        "Tinos",
      ],
      bold: [
        "Times New Roman Bold",
        "TimesNewRomanPS-BoldMT",
        "Liberation Serif Bold",
        "Tinos Bold",
      ],
    },
  ],
  [
    "monospace",
    {
      name: "Courier New",
      generic: "monospace",
      regular: ["Courier New", "CourierNewPSMT", "Liberation Mono", "Cousine"],
      bold: [
        "Courier New Bold",
        "CourierNewPS-BoldMT",
        "Liberation Mono Bold",
        "Cousine Bold",
      ],
    },
  ],
]);

const nearestWidth = (widths: Record<string, number>, weight: number) => {
  const [closest] = Object.keys(widths)
    .map(Number)
    .sort((a, b) => Math.abs(a - weight) - Math.abs(b - weight) || a - b);

  return widths[closest];
};

const percent = (value: number) => `${+(value * 100).toFixed(4)}%`;

// Грань на каждый вес страницы, а не одна на семейство: иначе жирный текст
// шёл бы синтетическим жирным из обычного Arial — с шириной обычного, а не
// жирного, — и строки ломались бы не там. Семейства нет в таблице — нет ни
// грани, ни стека, и страница пишет `"Имя", sans-serif`, как раньше.
export const fontFallback = (
  families: string[],
  weights: number[],
  metricsOf: (family: string) => FontMetricsRow | undefined,
): FontFallback => {
  const faces: string[] = [];
  const stacks: Record<string, string> = {};
  const faceWeights = [...new Set(weights.map(Number))]
    .filter(
      (weight) => Number.isInteger(weight) && weight > 0 && weight <= 1000,
    )
    .sort((a, b) => a - b);

  for (const family of new Set(families)) {
    const metrics = metricsOf(family);
    const local = metrics && LOCAL_BY_CATEGORY.get(metrics[0]);
    const localMetrics = local && metricsOf(local.name);

    if (!metrics || !local || !localMetrics || !faceWeights.length) {
      continue;
    }

    const [, unitsPerEm, ascent, descent, lineGap, widths] = metrics;
    const name = `${family} Fallback: ${local.name}`;

    for (const weight of faceWeights) {
      const bold = weight >= 600;
      const sizeAdjust =
        nearestWidth(widths, weight) /
        unitsPerEm /
        (nearestWidth(localMetrics[5], bold ? 700 : 400) / localMetrics[1]);
      // Переопределения метрик браузер ещё раз умножает на size-adjust.
      const adjustedEm = unitsPerEm * sizeAdjust;

      faces.push(
        [
          "@font-face {",
          `  font-family: "${name}";`,
          `  src: ${(bold ? local.bold : local.regular).map((font) => `local("${font}")`).join(", ")};`,
          `  font-weight: ${weight};`,
          "  font-style: normal;",
          `  size-adjust: ${percent(sizeAdjust)};`,
          `  ascent-override: ${percent(ascent / adjustedEm)};`,
          `  descent-override: ${percent(Math.abs(descent) / adjustedEm)};`,
          `  line-gap-override: ${percent(lineGap / adjustedEm)};`,
          "}",
        ].join("\n"),
      );
    }

    stacks[family] = `"${family}", "${name}", ${local.generic}`;
  }

  return { css: faces.join("\n"), stacks };
};

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
