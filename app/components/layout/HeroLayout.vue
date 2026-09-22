<template>
  <section
    class="site-hero relative overflow-hidden px-3 py-5 md:px-8 md:py-10"
  >
    <div
      class="site-hero-inner relative z-20 mx-auto grid w-full max-w-7xl gap-4"
      :class="photo ? 'md:grid-cols-[1.2fr_1fr] md:items-center md:gap-7' : ''"
    >
      <NuxtImg
        v-if="photo"
        provider="cloudinary"
        width="auto"
        height="auto"
        class="w-full rounded-primary object-cover md:order-last"
        :src="photo.src"
        :alt="photo.alt"
        :modifiers="siteConfig.img.modifiers"
      />

      <div class="site-hero-text grid content-start gap-2">
        <BreadcrumbsLayout
          v-if="breadcrumbs.length"
          :breadcrumbs="breadcrumbs"
        ></BreadcrumbsLayout>

        <span
          v-if="postDated"
          class="block text-step-8 font-medium text-ui-heading"
        >
          {{ siteConfig.translates.lastUpdated }}:
          <NuxtTime
            :datetime="postDated"
            month="long"
            day="2-digit"
            :locale="siteConfig.site.lang"
            year="numeric"
          />
        </span>

        <h1 v-if="leadTitle">
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
import BreadcrumbsLayout from "#rc/components/layout/BreadcrumbsLayout.vue";
import CtaButtonLayout from "#rc/components/layout/CtaButtonLayout.vue";
import RuntimeTemplateLayout from "#rc/components/layout/RuntimeTemplateLayout.vue";
import PostBiographyWriter from "#rc/components/post/PostBiographyWriter.vue";

const siteConfig = useSiteConfig();
const { breadcrumbs, postDated } = usePost();
// Картинка хиро — не своя, а та, что редактор поставил в лид блоком
// «картинка + текст»: отдельного поля под обложку в шаблоне нет. На телефоне
// она идёт сверху, на десктопе уходит во вторую колонку.
const { leadTitle, biography, photo, button } = useHeroContent();

const cta = computed(() => siteConfig.value.layout.header.cta);
</script>
