import { getCloudinaryBaseUrl } from "#rc/utils/get-cloudinary-base-url";

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
