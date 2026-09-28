// Без импортов: модуль гоняет голый `node --test`.

export type IconFile = { path: string; svg: string };

const ROOT_TAG = /<svg\b[^>]*>/i;
const NAMESPACE = /\sxmlns:[a-z]+="[^"]*"/gi;

// `client/bonus/dice.svg` → `client-bonus-dice`: тот же id, что `<svg-icon>`
// собирает из `name="client/bonus/dice"`.
export const symbolId = (path: string): string =>
  path.replace(/\.svg$/i, "").replace(/[\\/]/g, "-");

const viewBoxOf = (rootTag: string): string => {
  const viewBox = /\sviewBox="([^"]*)"/.exec(rootTag)?.[1];

  if (viewBox) {
    return viewBox;
  }

  const width = parseFloat(/\swidth="([^"]*)"/.exec(rootTag)?.[1] ?? "");
  const height = parseFloat(/\sheight="([^"]*)"/.exec(rootTag)?.[1] ?? "");

  return width > 0 && height > 0 ? `0 0 ${width} ${height}` : "0 0 24 24";
};

// Спрайт уходит браузеру отдельным XML-файлом, а не вставкой в HTML, и XML
// не прощает того, что прощал `innerHTML`: `<?xml …?>` посреди документа или
// префикс без объявления роняют разбор, и пропадают все иконки разом. Поэтому
// из файла берётся только то, что между корневым `<svg>` и его `</svg>`, а
// объявления префиксов переезжают на корень спрайта. Остальные атрибуты
// корня иконки отбрасываются, как отбрасывал прежний модуль: заливку иконке
// даёт `fill-*` на `<svg-icon>`.
export const buildSprite = (icons: IconFile[]): string => {
  const namespaces = new Set<string>();
  const symbols = [...icons]
    .sort((a, b) => a.path.localeCompare(b.path))
    .map(({ path, svg }) => {
      const root = ROOT_TAG.exec(svg);
      const rootTag = root?.[0] ?? "";
      const start = root ? root.index + rootTag.length : 0;
      const end = svg.lastIndexOf("</svg>");

      for (const namespace of rootTag.match(NAMESPACE) ?? []) {
        namespaces.add(namespace);
      }

      return `<symbol id="${symbolId(path)}" viewBox="${viewBoxOf(rootTag)}">${svg.slice(start, end < start ? undefined : end).trim()}</symbol>`;
    });

  return `<svg xmlns="http://www.w3.org/2000/svg"${[...namespaces].join("")}>\n${symbols.join("\n")}\n</svg>\n`;
};
