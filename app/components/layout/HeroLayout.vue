<template>
  <section
    class="site-hero relative overflow-hidden px-3 py-5 md:px-8 md:py-10"
  >
    <div
      class="site-hero-inner relative z-20 mx-auto grid w-full max-w-7xl gap-4"
      :class="photo ? 'md:grid-cols-[1.2fr_1fr] md:items-center md:gap-7' : ''"
    >
      <img
        v-if="picture"
        v-bind="picture"
        class="w-full rounded-primary object-cover md:order-last"
      />

      <div class="site-hero-text grid content-start gap-2">
        <PostMetaLayout></PostMetaLayout>

        <h1
          v-if="leadTitle"
          :id="titleId || undefined"
        >
          {{ leadTitle }}
        </h1>

        <PostBiographyWriter
          v-if="biography"
          :uniq-id="biography.uniqId"
          compact
        />

        <div v-if="button">
          <RuntimeTemplateLayout :template="button.html" />
        </div>
        <div v-else-if="cta.label">
          <CtaButtonLayout
            :label="cta.label"
            :link="cta.link"
            size="medium"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import CtaButtonLayout from "#rc/components/layout/CtaButtonLayout.vue";
import PostMetaLayout from "#rc/components/layout/PostMetaLayout.vue";
import RuntimeTemplateLayout from "#rc/components/layout/RuntimeTemplateLayout.vue";
import PostBiographyWriter from "#rc/components/post/PostBiographyWriter.vue";
import { imageLoading } from "#shared/utils/image-candidates";
import { imageSizes } from "#shared/utils/image-sizes";

const siteConfig = useSiteConfig();
// Картинка хиро — не своя, а та, что редактор поставил в лид блоком
// «картинка + текст»: отдельного поля под обложку в шаблоне нет. На телефоне
// она идёт сверху, на десктопе уходит во вторую колонку.
const { leadTitle, titleId, biography, photo, button } = useHeroContent();
const priorityImage = usePriorityImage();
const layout = usePageImageLayout();
const buildImage = useResponsiveImage();

const isPriority = computed(() => priorityImage.value?.place === "hero");

const picture = computed(() =>
  photo.value
    ? {
        ...buildImage(
          photo.value.img,
          imageSizes({ kind: "hero" }, layout.value),
          siteConfig.value.img.modifiers,
        ),
        ...imageLoading(isPriority.value),
        alt: photo.value.img.alt,
      }
    : null,
);

usePriorityImagePreload(
  computed(() => (isPriority.value ? picture.value : null)),
);

const cta = computed(() => siteConfig.value.layout.header.cta);
</script>
