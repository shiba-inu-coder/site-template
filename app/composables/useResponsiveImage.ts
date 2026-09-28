import type { ComputedRef, InjectionKey } from "vue";
import { responsiveImage } from "#shared/utils/image-candidates";
import { pageImageLayout } from "#shared/utils/image-sizes";
import type { ImageLayout } from "#shared/utils/image-sizes";

/**
 * Фон секции знает только PostSections, а картинку рисует блок внутри
 * скомпилированного тела — раскладку ему передаёт RuntimeTemplateLayout.
 */
export const IMAGE_LAYOUT_KEY: InjectionKey<ComputedRef<ImageLayout>> =
  Symbol("image-layout");

export const usePageImageLayout = () => {
  const { frame } = useUiTheme();
  const { sections } = usePost();

  return computed(() =>
    pageImageLayout(frame.value, sections.value.length > 0),
  );
};

export const useImageLayout = () =>
  inject(IMAGE_LAYOUT_KEY, null) ?? usePageImageLayout();

type CloudinaryOptions = {
  provider: "cloudinary";
  modifiers?: Record<string, unknown>;
};

// Типы @nuxt/image знают только провайдер по умолчанию (ipx): cloudinary
// сконфигурирован и в рантайме есть, но в ImageOptions его не пропустить.
export const useCloudinaryImage = () =>
  useImage() as unknown as {
    (
      source: string,
      modifiers: Record<string, unknown>,
      options: CloudinaryOptions,
    ): string;
    getSizes: (
      source: string,
      options: CloudinaryOptions,
    ) => { src?: string; srcset: string };
  };

/**
 * Кандидаты и атрибуты картинки из Cloudinary. URL строит @nuxt/image, набор
 * ширин — `responsiveImage`. `c_limit` на каждом кандидате: размеры в записи —
 * утверждение панели, а не замер, и без него неверная ширина снова дала бы
 * растянутый файл.
 */
export const useResponsiveImage = () => {
  const $img = useCloudinaryImage();

  return (
    img: { path: string; width?: unknown; height?: unknown },
    sizes: string,
    modifiers: Record<string, unknown> = {},
  ) => {
    // Пустое скругление бренда дало бы в URL голое `r_`.
    const own = Object.fromEntries(
      Object.entries(modifiers).filter(
        ([, value]) => value !== "" && value !== null && value !== undefined,
      ),
    );

    return responsiveImage(img, sizes, (width) =>
      $img(
        img.path,
        { ...own, width, fit: "coverLimit" },
        { provider: "cloudinary" },
      ),
    );
  };
};
