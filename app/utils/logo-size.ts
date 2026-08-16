import { seoConfig } from "@@/seo.conf";

export const logoSize = (height: number) => {
  const { width, height: intrinsicHeight } = seoConfig.logo;

  return {
    height,
    width: Math.round(height * (width / intrinsicHeight)),
  };
};
