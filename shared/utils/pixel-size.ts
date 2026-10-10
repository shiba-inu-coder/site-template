/**
 * Размер картинки, который оператор вписал руками: число пикселей («320»,
 * «320px») или «auto». Всё, что не число, — «auto», то есть размер решает
 * раскладка блока, а не запись.
 */
export const parsePixelSize = (raw: unknown): number | undefined => {
  const value = `${raw ?? ""}`.trim().toLowerCase();

  if (!/^\d+(\.\d+)?(px)?$/.test(value)) {
    return undefined;
  }

  const pixels = Math.round(parseFloat(value));

  return pixels > 0 ? pixels : undefined;
};
