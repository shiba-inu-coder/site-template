export const GRID_CARDS_VARIANTS = [
  "image",
  "image-caption",
  "image-title-text",
] as const;

export type GridCardsVariant = (typeof GRID_CARDS_VARIANTS)[number];

// Не enum, а перевод: "1" и "2" писала панель до появления вариантов вёрстки,
// text, offer и horizontal — до того, как карточка свелась к трём составам.
// Все пять лежат и в записях, и в темах сайтов, и не мигрируются.
const LEGACY: Record<string, GridCardsVariant> = {
  "1": "image-caption",
  "2": "image-title-text",
  text: "image-title-text",
  offer: "image-title-text",
  horizontal: "image-title-text",
};

const translate = (value: string) =>
  Object.hasOwn(LEGACY, value) ? LEGACY[value] : value;

const isVariant = (value: string): value is GridCardsVariant =>
  (GRID_CARDS_VARIANTS as readonly string[]).includes(value);

/**
 * Тот же порядок, что у `pickVariant` (запись → тема → дефолт блока), но с
 * переводом старых значений до проверки. Флаг горизонтальной раскладки
 * смотрит на кандидата до перевода: только по нему видно, что старое значение
 * было horizontal, а не просто image-title-text.
 */
export const resolveGridCardsLayout = (
  own: string | null | undefined,
  theme: string | null | undefined,
  horizontal: boolean | null | undefined,
): { variant: GridCardsVariant; horizontal: boolean } => {
  for (const candidate of [own, theme]) {
    if (!candidate) {
      continue;
    }

    const variant = translate(candidate);

    if (isVariant(variant)) {
      return {
        variant,
        horizontal: horizontal === true || candidate === "horizontal",
      };
    }
  }

  return { variant: "image-caption", horizontal: horizontal === true };
};
