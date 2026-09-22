/**
 * Разбор маркеров шорткодов в теле секции. Нужен ровно одному потребителю —
 * хиро, который забирает из лида строку автора, картинку и кнопку, а из тела
 * их убирает, чтобы те не отрисовались дважды.
 *
 * Обход со счётчиком глубины, а не нежадный regex до первого `</div>`: тело
 * блока само может содержать вложенные `<div>` (редактор заворачивает в них
 * текст ячейки), и нежадный поиск обрывался бы на первом закрывающем теге.
 * Зеркало `replaceShortcodeMarkers` в панели.
 */

export interface ShortcodeMarker {
  name: string;
  uniqId: string;
  html: string;
}

const MARKER_NAME_RE = /\bis="vue:([a-zA-Z0-9_-]+)"/i;
const MARKER_UNIQ_ID_RE = /\buniq-id="([^"]*)"/i;

const replaceMarkers = (
  html: string,
  replacer: (marker: string) => string,
): string => {
  const text = `${html || ""}`;
  const tagRe = /<(\/)?div\b[^>]*>/gi;
  let result = "";
  let cursor = 0;
  let depth = 0;
  let markerStart = -1;
  let match: RegExpExecArray | null;

  while ((match = tagRe.exec(text))) {
    const isClose = Boolean(match[1]);
    const tagEnd = tagRe.lastIndex;

    if (depth === 0) {
      if (isClose || !MARKER_NAME_RE.test(match[0])) {
        continue;
      }

      result += text.slice(cursor, match.index);
      markerStart = match.index;
      depth = 1;
      continue;
    }

    depth += isClose ? -1 : 1;

    if (depth === 0) {
      result += replacer(text.slice(markerStart, tagEnd));
      cursor = tagEnd;
    }
  }

  // Маркер без своего `</div>` дочитывается до конца строки, а не роняет разбор.
  return depth > 0
    ? result + replacer(text.slice(markerStart))
    : result + text.slice(cursor);
};

export const findShortcodeMarkers = (html: string): ShortcodeMarker[] => {
  const markers: ShortcodeMarker[] = [];

  replaceMarkers(html, (marker) => {
    const name = marker.match(MARKER_NAME_RE)?.[1] || "";

    if (name) {
      markers.push({
        name,
        uniqId: marker.match(MARKER_UNIQ_ID_RE)?.[1] || "",
        html: marker,
      });
    }

    return marker;
  });

  return markers;
};

export const removeShortcodeMarkers = (
  html: string,
  names: string[],
): string => {
  if (!names.length) {
    return html || "";
  }

  return replaceMarkers(html, (marker) => {
    const name = marker.match(MARKER_NAME_RE)?.[1] || "";

    return names.includes(name) ? "" : marker;
  });
};
