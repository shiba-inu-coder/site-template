export interface HeroImage {
  path: string;
  alt: string;
  width?: number;
  height?: number;
}

type HeroImageSource = {
  path?: string;
  alt?: string;
  width?: number;
  height?: number;
} | null;

/**
 * Картинка баннера страницы: своя, если у страницы есть `path`, иначе общая
 * картинка сайта. Alt страницы важнее общего, даже когда картинка берётся
 * общая: правка alt на одной странице не должна требовать своей картинки.
 */
export const resolveHeroImage = (
  pageImg?: HeroImageSource,
  siteBanner?: HeroImageSource,
): HeroImage | null => {
  if (pageImg?.path) {
    return pageImg as HeroImage;
  }

  if (!siteBanner?.path) {
    return null;
  }

  return {
    path: siteBanner.path,
    alt: pageImg?.alt || siteBanner.alt || "",
    width: siteBanner.width,
    height: siteBanner.height,
  };
};
