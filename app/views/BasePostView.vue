<template>
  <div
    id="article"
    class="mt-18"
  >
    <slot>
      <IntroLayout></IntroLayout>
      <!-- Статья из конструктора рисуется секциями и БЕЗ общего контейнера:
           у каждой секции свой фон и своя ширина, а внешний max-w-7xl обрезал
           бы полноширинные по колонке текста. Пост без секций — всё, что
           написано до конструктора, — идёт прежним путём. -->
      <PostSections
        v-if="sections?.length"
        :sections="sections"
        :slug="slug"
      />
      <div
        v-else
        class="px-2.5 md:px-4 xl:px-0 w-full max-w-7xl mx-auto relative"
      >
        <RuntimeTemplateLayout
          :slug="slug"
          :template="content"
        />
      </div>
      <BonusLayout></BonusLayout>
      <ButtonFastUpLayout></ButtonFastUpLayout>
    </slot>
  </div>
</template>
<script setup lang="ts">
import BonusLayout from "#rc/components/layout/BonusLayout.vue";
import RuntimeTemplateLayout from "#rc/components/layout/RuntimeTemplateLayout.vue";
import PostSections from "#rc/components/post/PostSections.vue";
import IntroLayout from "#rc/components/layout/IntroLayout.vue";
import ButtonFastUpLayout from "#rc/components/layout/ButtonFastUpLayout.vue";
import { seoConfig } from "@@/seo.conf";
import { getCloudinaryBaseUrl } from "#rc/utils/get-cloudinary-base-url";
import { logoSize } from "#rc/utils/logo-size";

const { createdAt, updatedAt, content, sections, slug, metaTags, title } =
  usePost();

const SITE_URL = computed(() => useRuntimeConfig().public.SITE_URL);
const CLOUDINARY_BASE_URL = computed(() =>
  getCloudinaryBaseUrl(useRuntimeConfig().public.CLOUDINARY_CLOUD_NAME),
);
const DOMAIN_NAME = computed(() => useRuntimeConfig().public.DOMAIN_NAME);
const articleUrl = computed(() => `${SITE_URL.value}${useRoute().path}`);
const websiteId = computed(() => `${SITE_URL.value}#website`);
const webpage = computed(() => `${SITE_URL.value}#webpage`);
const baseId = computed(() => `${articleUrl.value}#`);
const article = computed(() => `${baseId.value}article`);

useSchemaOrg([
  {
    "@type": "WebSite",
    "@id": websiteId.value,
    url: `${SITE_URL.value}/`,
    name: DOMAIN_NAME.value,
    inLanguage: seoConfig.site.lang,
  },
  {
    "@id": webpage.value,
    "@type": "WebPage",
    description: metaTags.value.description,
    name: seoConfig.site.name,
    url: articleUrl.value,
    isPartOf: {
      "@id": websiteId.value,
    },
    mainEntity: {
      "@type": "Article",
      "@id": article.value,
    },
    potentialAction: [
      {
        "@type": "ReadAction",
        target: [articleUrl.value],
      },
    ],
  },
  {
    "@type": "Article",
    "@id": article.value,
    headline: title.value,
    name: title.value,
    url: articleUrl.value,
    description: metaTags.value.description,
    datePublished: createdAt.value,
    dateModified: updatedAt.value,
    inLanguage: seoConfig.site.lang,

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": webpage.value,
    },

    isPartOf: { "@id": websiteId.value },

    publisher: {
      "@type": "Organization",
      name: DOMAIN_NAME.value,
      url: `${SITE_URL.value}/`,
      logo: {
        "@type": "ImageObject",
        url: `${CLOUDINARY_BASE_URL.value}f_auto,q_auto,r_15,h_45/${seoConfig.logo.src}`,
        ...logoSize(45),
      },
    },
  },
]);
</script>
