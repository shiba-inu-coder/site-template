<template>
  <section
    v-if="picture"
    data-part="page-hero"
    class="w-full bg-ui-header-bg border-b border-ui-panel-border"
  >
    <div
      class="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-4 px-2.5 py-4 md:grid-cols-2 md:gap-8 md:px-4 md:py-8 xl:px-0"
    >
      <div class="order-last flex flex-col gap-3 md:order-first">
        <span
          v-if="ribbon"
          class="text-step-8 font-semibold uppercase text-ui-text"
          >{{ ribbon }}</span
        >
        <p
          v-if="bonus"
          class="text-step-3 font-bold leading-tight text-ui-heading"
        >
          {{ bonus }}
        </p>
        <div v-if="hasCta">
          <CtaButtonLayout
            :label="buttonLabel"
            :link="buttonLink"
            :ref-key="REF_KEY.heroCta"
            :ref-block="REF_BLOCK.hero"
            size="medium"
          />
        </div>
      </div>

      <img
        v-bind="picture"
        class="h-auto w-full rounded-primary"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import CtaButtonLayout from "#rc/components/layout/CtaButtonLayout.vue";
import { REF_BLOCK, REF_KEY } from "#shared/constants/ref-buttons";
import { imageLoading } from "#shared/utils/image-candidates";
import { HERO_UNIQ_ID } from "#shared/utils/priority-image";

// Картинка занимает полколонки контейнера на планшете и шире, на телефоне —
// всю ширину.
const HERO_SIZES = "(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw";

const { ribbon, bonus, img, buttonLabel, buttonLink, hasCta } = usePageHero();
const priorityImage = usePriorityImage();
const buildImage = useResponsiveImage();

const isPriority = computed(
  () =>
    priorityImage.value?.place === "hero" &&
    priorityImage.value.uniqId === HERO_UNIQ_ID,
);

const picture = computed(() => {
  if (!img.value) {
    return null;
  }

  return {
    ...buildImage(img.value, HERO_SIZES),
    ...imageLoading(isPriority.value),
    alt: img.value.alt,
  };
});

usePriorityImagePreload(
  computed(() => (isPriority.value ? picture.value : null)),
);
</script>
