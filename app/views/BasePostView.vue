<template>
  <div
    id="article"
    class="mt-18"
  >
    <slot>
      <IntroLayout></IntroLayout>
      <div class="px-2.5 md:px-4 xl:px-0 w-full max-w-7xl mx-auto relative">
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
import IntroLayout from "#rc/components/layout/IntroLayout.vue";
import ButtonFastUpLayout from "#rc/components/layout/ButtonFastUpLayout.vue";
import { seoConfig } from "@@/seo.conf";

const { createdAt, updatedAt, content, slug, metaTags, title } = usePost();

const SITE_URL = computed(() => useRuntimeConfig().public.SITE_URL);
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
        url: `https://res.cloudinary.com/duhutcvan/image/upload/f_auto,q_auto,r_15,h_45/${seoConfig.logo.src}.svg`,
        width: 152,
        height: 35,
      },
    },
  },
]);
</script>
