import { parsePixelSize } from "./pixel-size.ts";

export const DATA_TABLE_IMAGE_MIN = 12;
export const DATA_TABLE_IMAGE_MAX = 400;
export const DATA_TABLE_IMAGE_DEFAULT_HEIGHT = 40;

export interface DataTableImageSize {
  width?: number;
  height?: number;
  framed: boolean;
}

const pick = (raw: unknown): number | undefined => {
  const pixels = parsePixelSize(raw);

  if (pixels === undefined) {
    return undefined;
  }

  return Math.min(Math.max(pixels, DATA_TABLE_IMAGE_MIN), DATA_TABLE_IMAGE_MAX);
};

/**
 * Размер картинок во всех ячейках таблицы: на записи таблицы лежат две строки,
 * у отдельной картинки размера нет. Пусто — высота по умолчанию, ширина по
 * пропорциям; обе стороны — рамка, в которую картинка вписана целиком.
 */
export const dataTableImageSize = (
  width: unknown,
  height: unknown,
): DataTableImageSize => {
  const w = pick(width);
  const h = pick(height);

  if (w === undefined && h === undefined) {
    return { height: DATA_TABLE_IMAGE_DEFAULT_HEIGHT, framed: false };
  }

  return { width: w, height: h, framed: w !== undefined && h !== undefined };
};
