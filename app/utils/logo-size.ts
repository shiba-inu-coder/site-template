import { seoConfig } from "@@/seo.conf";

// Логотип бренда — и квадратный значок, и длинный вордмарк, поэтому размер
// задаётся высотой. `maxWidth` — второй предел: вордмарк, влезающий по высоте,
// разносит шапку по ширине, и тогда вниз едет высота, а не вёрстка.
export const logoSize = (height: number, maxWidth?: number) => {
  const { width, height: intrinsicHeight } = seoConfig.logo;

  // Пустой манифест (шаблон до применения бренда) или нулевые размеры: считать
  // пропорцию не из чего, отдаём одну высоту — ширину подберёт браузер.
  if (!(width > 0) || !(intrinsicHeight > 0)) {
    return { height };
  }

  const ratio = width / intrinsicHeight;
  const scaledWidth = Math.round(height * ratio);

  if (maxWidth && scaledWidth > maxWidth) {
    return { height: Math.round(maxWidth / ratio), width: maxWidth };
  }

  return { height, width: scaledWidth };
};
