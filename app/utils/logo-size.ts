// Логотип бренда — и квадратный значок, и длинный вордмарк, поэтому размер
// задаётся высотой. `maxWidth` — второй предел: вордмарк, влезающий по высоте,
// разносит шапку по ширине, и тогда вниз едет высота, а не вёрстка.
//
// Сам логотип передаётся параметром: файл не композабл, а вызывают его из
// шаблонов, где конфиг сайта уже разрешён (`useSiteConfig()`).
export const logoSize = (
  logo: SiteLogo | undefined,
  height: number,
  maxWidth?: number,
): { height: number; width?: number } => {
  const { width, height: intrinsicHeight } = logo || {};

  // Пустой манифест (шаблон до применения бренда) или нулевые размеры: считать
  // пропорцию не из чего, отдаём одну высоту — ширину подберёт браузер.
  if (!(width > 0) || !(intrinsicHeight > 0)) {
    return { height, width: undefined };
  }

  const ratio = width / intrinsicHeight;
  const scaledWidth = Math.round(height * ratio);

  if (maxWidth && scaledWidth > maxWidth) {
    return { height: Math.round(maxWidth / ratio), width: maxWidth };
  }

  return { height, width: scaledWidth };
};
