import { getCloudinaryBaseUrl } from "#rc/utils/get-cloudinary-base-url";

/**
 * Оформление секции статьи → строка инлайн-стиля.
 *
 * Зеркало `shared/utils/article-sections.js` из AppsPro: панель собирает этой
 * же формулой запасной HTML для сайтов, которые ещё не переехали на секции.
 * Разойдутся формулы — одна и та же статья будет выглядеть по-разному в
 * зависимости от того, какой из двух путей отрисовал её на сайте. Правка здесь
 * означает правку там, и наоборот.
 *
 * Цвет из токена уходит через `color-mix` на CSS-переменную темы, а не
 * разворачивается в конкретный цвет: перекраска бренда должна доставать и уже
 * написанные статьи. Tailwind тут ни при чём — значения приезжают из Mongo,
 * а `@config` в `tailwind.css` отключает автосканирование, так что ни один
 * собранный из кусков класс до сборки бы не доехал.
 */

const PADDING_CSS: Record<string, string> = {
  none: "0",
  sm: "1rem 0",
  md: "2.5rem 0",
  lg: "4.5rem 0",
};

const clampPercent = (value: unknown, fallback = 0): number => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.min(100, Math.max(0, Math.round(number)));
};

const alphaSuffix = (opacity: unknown): string =>
  Math.round((clampPercent(opacity, 100) / 100) * 255)
    .toString(16)
    .padStart(2, "0");

export const sectionBackgroundColor = (bg?: PostSectionBg): string => {
  const opacity = clampPercent(bg?.opacity, 100);

  if (bg?.token) {
    return opacity >= 100
      ? `var(--color-${bg.token})`
      : `color-mix(in srgb, var(--color-${bg.token}) ${opacity}%, transparent)`;
  }

  if (bg?.hex) {
    return opacity >= 100 ? bg.hex : `${bg.hex}${alphaSuffix(opacity)}`;
  }

  return "";
};

/**
 * Затемнение — вторым слоем градиента, а не трансформацией Cloudinary: правка
 * ползунка в панели не должна перезаливать ассет.
 */
export const sectionBackgroundImage = (
  image: PostSectionImage | undefined,
  cloudName: string,
): string => {
  if (!image?.path) {
    return "";
  }

  // Внешнюю ссылку пропускаем как есть: в поле пути иногда вбивают чужой URL.
  const url = /^https?:\/\//.test(image.path)
    ? image.path
    : `${getCloudinaryBaseUrl(cloudName)}f_auto,q_auto/${image.path}`;

  const overlay = clampPercent(image.overlay, 0);
  const layers: string[] = [];

  if (overlay > 0) {
    const alpha = (overlay / 100).toFixed(2);
    layers.push(`linear-gradient(rgba(0,0,0,${alpha}),rgba(0,0,0,${alpha}))`);
  }

  layers.push(`url(${url})`);

  return layers.join(",");
};

export const sectionStyle = (
  layout: PostSectionLayout | undefined,
  cloudName: string,
): string => {
  const declarations: string[] = [];
  const color = sectionBackgroundColor(layout?.bg);
  const image = sectionBackgroundImage(layout?.image, cloudName);
  const padding = PADDING_CSS[layout?.padding ?? "md"] ?? PADDING_CSS.md;

  if (color) {
    declarations.push(`background-color:${color}`);
  }

  if (image) {
    declarations.push(`background-image:${image}`);
  }

  if (padding !== "0") {
    declarations.push(`padding:${padding}`);
  }

  return declarations.join(";");
};
