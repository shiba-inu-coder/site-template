import type { ComputedRef } from "vue";
import type { ResponsiveImageAttrs } from "#shared/utils/image-candidates";
import { resolvePriorityImage } from "#shared/utils/priority-image";

/** Какая картинка страницы приоритетная — одна или ни одной. */
export const usePriorityImage = () => {
  const { sections, content, textImages } = usePost();
  const { content: hero } = useHeroContent();

  return computed(() =>
    resolvePriorityImage({
      hero: hero.value,
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
  picture: ComputedRef<ResponsiveImageAttrs | null>,
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
