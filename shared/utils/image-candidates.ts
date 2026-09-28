/**
 * Набор кандидатов для `srcset`. Свой, а не @nuxt/image: тот пишет
 * дескриптор по запрошенной ширине, а не по файлу — `w_2560` из оригинала
 * в 1344 px Cloudinary растягивает, и браузер получает 2560 px размытой
 * картинки. Здесь лестница обрезается по ширине оригинала, а URL строит тот же
 * @nuxt/image — компонент подаёт его построитель в `urlFor`.
 */

export const IMAGE_WIDTHS = [320, 480, 640, 768, 960, 1280, 1600, 1920, 2560];

// Шире колонки статьи (1280 px) на ретине картинке показываться негде, а
// без размеров оригинала каждая лишняя ступенька — ещё один файл в кеше
// Cloudinary того же размера: c_limit не даст ему вырасти.
const UNKNOWN_WIDTH_CEILING = 1920;

// Отдаётся браузеру без srcset (и индексатору, который его не читает):
// самая крупная ступенька, что ещё влезает в колонку статьи.
const FALLBACK_WIDTH = 1280;

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ResponsiveImageAttrs {
  src: string;
  srcset: string;
  sizes: string;
  width?: number;
  height?: number;
}

/** Размеры файла из записи — или ничего, если записи верить нечему. */
export const imageDimensions = (
  img: { width?: unknown; height?: unknown } | null | undefined,
): ImageDimensions | null => {
  const width = Math.round(Number(img?.width));
  const height = Math.round(Number(img?.height));

  return width > 0 && height > 0 ? { width, height } : null;
};

export const candidateWidths = (originalWidth?: number | null): number[] => {
  if (!originalWidth || originalWidth <= 0) {
    return IMAGE_WIDTHS.filter((width) => width <= UNKNOWN_WIDTH_CEILING);
  }

  const widths = IMAGE_WIDTHS.filter((width) => width < originalWidth);

  // Оригинал шире верхней ступеньки целиком не предлагается: его не
  // попросит ни одна раскладка шаблона.
  if (originalWidth <= IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1]) {
    widths.push(originalWidth);
  }

  return widths;
};

export const responsiveImage = (
  img: { width?: unknown; height?: unknown },
  sizes: string,
  urlFor: (width: number) => string,
): ResponsiveImageAttrs => {
  const dimensions = imageDimensions(img);
  const widths = candidateWidths(dimensions?.width);
  const fallback =
    [...widths].reverse().find((width) => width <= FALLBACK_WIDTH) ?? widths[0];

  return {
    src: urlFor(fallback),
    srcset: widths.map((width) => `${urlFor(width)} ${width}w`).join(", "),
    sizes,
    ...(dimensions || {}),
  };
};

/**
 * Приоритетная картинка на странице одна, её выбирает `resolvePriorityImage`;
 * блок сам `loading` не решает.
 */
export const imageLoading = (priority: boolean) =>
  priority
    ? ({ loading: "eager", fetchpriority: "high" } as const)
    : ({ loading: "lazy" } as const);
