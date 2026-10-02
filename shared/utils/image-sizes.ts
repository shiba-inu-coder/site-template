/**
 * `sizes` для браузера — ширина места под картинкой, а не доля вьюпорта.
 * Проп `sizes` у NuxtImg понимает только `px`/`vw` по брейкпоинтам и теряет
 * `calc()`, а колонка статьи — это вьюпорт минус отступы контейнера, минус
 * padding секции с фоном. Поэтому ширина считается здесь, по
 * кускам: на каждом диапазоне вьюпорта она линейна (`a·100vw + b`).
 *
 * Числа — из классов компонентов, и меняются вместе с ними:
 * PostSections (CONTAINER и фон секции), PostTextImage, PostGridCards,
 * `data-width="narrow"` в tailwind.css.
 */

const MD = 768;
const XL = 1280;

const CONTAINER_MAX = 1280; // max-w-7xl
const NARROW_MAX = 832; // 52rem
// px-2.5 md:px-4 xl:px-0 — обе стороны
const containerPadding = (from: number) =>
  from >= XL ? 0 : from >= MD ? 32 : 20;

const SECTION_PADDING = 16; // p-primary-1: 8px с каждой стороны
const TEXT_IMAGE_GAP = 24; // md:gap-6
const CARD_GAP = 32; // gap-8
const CARD_HORIZONTAL_SHARE = 0.36; // w-[36%]

export type ImageRole =
  | { kind: "column" }
  | { kind: "half" }
  | { kind: "card"; perRow: number; horizontal: boolean };

export interface ImageLayout {
  narrow: boolean;
  sectionBg: "none" | "wrap" | "box";
}

export const pageImageLayout = (frame: { width?: string }): ImageLayout => ({
  narrow: frame.width === "narrow",
  sectionBg: "none",
});

interface Piece {
  from: number;
  a: number;
  b: number;
}

type Width = Piece[];

const VIEWPORT: Width = [{ from: 0, a: 1, b: 0 }];

const nextFrom = (width: Width, index: number) =>
  width[index + 1]?.from ?? Infinity;

const splitAt = (width: Width, at: number): Width =>
  width.flatMap((piece, index) =>
    at > piece.from && at < nextFrom(width, index)
      ? [piece, { ...piece, from: at }]
      : [piece],
  );

const map = (width: Width, fn: (piece: Piece) => Piece, from = 0): Width =>
  splitAt(width, from).map((piece) =>
    piece.from >= from ? { ...fn(piece), from: piece.from } : piece,
  );

// Отступ, свой на каждом диапазоне брейкпоинтов.
const minus = (width: Width, by: (from: number) => number): Width =>
  [MD, XL]
    .reduce(splitAt, width)
    .map((piece) => ({ ...piece, b: piece.b - by(piece.from) }));

const cap = (width: Width, max: number): Width =>
  width.flatMap((piece, index) => {
    if (piece.a <= 0) {
      return [{ ...piece, b: Math.min(piece.b, max) }];
    }

    const reached = (max - piece.b) / piece.a;

    if (reached <= piece.from) {
      return [{ from: piece.from, a: 0, b: max }];
    }

    return reached < nextFrom(width, index)
      ? [piece, { from: reached, a: 0, b: max }]
      : [piece];
  });

const articleColumn = (layout: ImageLayout): Width => {
  let outer = VIEWPORT;

  // Полоса во всю ширину несёт padding сама, контейнер стоит внутри неё.
  if (layout.sectionBg === "wrap") {
    outer = map(outer, (piece) => ({ ...piece, b: piece.b - SECTION_PADDING }));
  }

  const max = layout.narrow ? NARROW_MAX : CONTAINER_MAX;
  const column = minus(cap(outer, max), containerPadding);

  // Коробка с фоном — сама <section> внутри контейнера, padding у неё.
  return layout.sectionBg === "box"
    ? map(column, (piece) => ({ ...piece, b: piece.b - SECTION_PADDING }))
    : column;
};

// Ниже md сетка всегда в одну колонку: и половинка, и карточка там — вся
// колонка статьи.
const columns = (width: Width, count: number, gap: number): Width =>
  map(
    width,
    (piece) => ({
      ...piece,
      a: piece.a / count,
      b: (piece.b - gap * (count - 1)) / count,
    }),
    MD,
  );

const roleWidth = (role: ImageRole, layout: ImageLayout): Width => {
  switch (role.kind) {
    case "half":
      return columns(articleColumn(layout), 2, TEXT_IMAGE_GAP);
    case "card": {
      const perRow = Math.min(12, Math.max(1, Math.round(role.perRow) || 1));
      const cards = columns(articleColumn(layout), perRow, CARD_GAP);

      return role.horizontal
        ? map(cards, (piece) => ({
            ...piece,
            a: piece.a * CARD_HORIZONTAL_SHARE,
            b: piece.b * CARD_HORIZONTAL_SHARE,
          }))
        : cards;
    }
    default:
      return articleColumn(layout);
  }
};

const lengthOf = ({ a, b }: { a: number; b: number }) => {
  if (a === 0) {
    return `${b}px`;
  }

  if (b === 0) {
    return `${a}vw`;
  }

  return `calc(${a}vw ${b < 0 ? "-" : "+"} ${Math.abs(b)}px)`;
};

export const imageSizes = (role: ImageRole, layout: ImageLayout): string => {
  const pieces = roleWidth(role, layout)
    .map((piece) => ({
      from: Math.ceil(piece.from),
      a: Math.round(piece.a * 10000) / 100,
      b: Math.round(piece.b),
    }))
    .filter(
      (piece, index, all) =>
        index === 0 ||
        piece.a !== all[index - 1].a ||
        piece.b !== all[index - 1].b,
    );

  return pieces
    .reverse()
    .map((piece) =>
      piece.from > 0
        ? `(min-width: ${piece.from}px) ${lengthOf(piece)}`
        : lengthOf(piece),
    )
    .join(", ");
};
