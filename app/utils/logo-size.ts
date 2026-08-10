import { seoConfig } from "@@/seo.conf";

// Лого у брендов бывают и квадратные, и вытянутые. Поэтому задаём высоту, а ширину
// считаем из собственных пропорций файла: при фиксированной ширине квадратное лого
// раздувается по высоте и ломает шапку, а вытянутое становится нечитаемым.
export const logoSize = (height: number) => {
  const { width, height: intrinsicHeight } = seoConfig.logo;

  return {
    height,
    width: Math.round(height * (width / intrinsicHeight)),
  };
};
