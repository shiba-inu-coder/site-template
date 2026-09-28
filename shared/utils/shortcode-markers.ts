/**
 * Разбор маркеров шорткодов в теле секции. Читают двое: хиро, который
 * забирает из лида строку автора, картинку и кнопку, и выбор приоритетной
 * картинки, которому нужен порядок блоков и текста в лиде.
 *
 * Обход со счётчиком глубины, а не нежадный regex до первого `</div>`: тело
 * блока само может содержать вложенные `<div>` (редактор заворачивает в них
 * текст ячейки), и нежадный поиск обрывался бы на первом закрывающем теге.
 * Зеркало `replaceShortcodeMarkers` в панели.
 */

export interface ShortcodeMarker {
  name: string;
  uniqId: string;
  // Порядковый номер среди маркеров той же строки: два маркера с одним
  // uniq-id (редактор скопировал блок) различает только он.
  index: number;
  html: string;
}

export type ShortcodePart = string | ShortcodeMarker;

const MARKER_NAME_RE = /\bis="vue:([a-zA-Z0-9_-]+)"/i;
const MARKER_UNIQ_ID_RE = /\buniq-id="([^"]*)"/i;

const splitMarkup = (html: string): { html: string; marker: boolean }[] => {
  const text = `${html || ""}`;
  const tagRe = /<(\/)?div\b[^>]*>/gi;
  const parts: { html: string; marker: boolean }[] = [];
  let cursor = 0;
  let depth = 0;
  let markerStart = -1;
  let match: RegExpExecArray | null;

  while ((match = tagRe.exec(text))) {
    const isClose = Boolean(match[1]);

    if (depth === 0) {
      if (isClose || !MARKER_NAME_RE.test(match[0])) {
        continue;
      }

      parts.push({ html: text.slice(cursor, match.index), marker: false });
      markerStart = match.index;
      depth = 1;
      continue;
    }

    depth += isClose ? -1 : 1;

    if (depth === 0) {
      parts.push({
        html: text.slice(markerStart, tagRe.lastIndex),
        marker: true,
      });
      cursor = tagRe.lastIndex;
    }
  }

  // Маркер без своего `</div>` дочитывается до конца строки, а не роняет разбор.
  parts.push(
    depth > 0
      ? { html: text.slice(markerStart), marker: true }
      : { html: text.slice(cursor), marker: false },
  );

  return parts.filter((part) => part.marker || part.html);
};

/** HTML между маркерами — строками, сами маркеры — объектами, в порядке тела. */
export const splitShortcodeMarkers = (html: string): ShortcodePart[] => {
  let index = 0;

  return splitMarkup(html).map((part) =>
    part.marker
      ? {
          name: part.html.match(MARKER_NAME_RE)?.[1] || "",
          uniqId: part.html.match(MARKER_UNIQ_ID_RE)?.[1] || "",
          index: index++,
          html: part.html,
        }
      : part.html,
  );
};

export const findShortcodeMarkers = (html: string): ShortcodeMarker[] =>
  splitShortcodeMarkers(html).filter(
    (part): part is ShortcodeMarker => typeof part !== "string",
  );

/**
 * Убирает ровно те экземпляры, что найдены в этой же строке, а не все маркеры
 * того же имени: у лида бывает два автора и две кнопки, и в хиро уезжает
 * только первый.
 */
export const removeShortcodeMarkers = (
  html: string,
  markers: ShortcodeMarker[],
): string => {
  if (!markers.length) {
    return html || "";
  }

  return splitShortcodeMarkers(html)
    .map((part) => {
      if (typeof part === "string") {
        return part;
      }

      const moved = markers.some(
        (marker) =>
          marker.index === part.index &&
          marker.name === part.name &&
          marker.uniqId === part.uniqId,
      );

      return moved ? "" : part.html;
    })
    .join("");
};
