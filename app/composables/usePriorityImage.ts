import type { ComputedRef } from "vue";
import { resolveHeroImage } from "#shared/utils/hero-image";
import { resolvePriorityImage } from "#shared/utils/priority-image";

/** Какая картинка страницы приоритетная — одна или ни одной. */
export const usePriorityImage = () => {
  const { banner, sections, content, textImages } = usePost();
  const siteConfig = useSiteConfig();

  return computed(() =>
    resolvePriorityImage({
      banner: {
        img: resolveHeroImage(banner.value?.img, siteConfig.value.banner),
      },
      sections: sections.value,
      content: content.value,
      textImages: textImages.value,
    }),
  );
};

/**
 * Preload ставит сам блок приоритетной картинки из тех же атрибутов, что
 * отдаёт своему <img>: srcset/sizes у ссылки и у картинки не могут
 * разойтись. Проп `preload` у NuxtImg для этого не годится — он собирает
 * свой набор.
 */
export const usePriorityImagePreload = (
  picture: ComputedRef<{
    src: string;
    srcset: string;
    sizes?: string;
  } | null>,
) =>
  useHead(() => {
    const image = picture.value;

    return image
      ? {
          link: [
            {
              key: "priority-image",
              rel: "preload",
              as: "image",
              href: image.src,
              imagesrcset: image.srcset,
              imagesizes: image.sizes,
              fetchpriority: "high",
            },
          ],
        }
      : {};
  });
