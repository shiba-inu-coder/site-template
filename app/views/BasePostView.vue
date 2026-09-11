<template>
  <div
    id="article"
    class="mt-18"
  >
    <slot>
      <template v-if="sections?.length">
        <div class="px-2.5 md:px-4 xl:px-0 w-full max-w-7xl mx-auto">
          <span
            v-if="postDated"
            class="text-step-8 text-accent-200 font-medium block"
          >
            {{ seoConfig.translates.lastUpdated }}:
            <NuxtTime
              :datetime="postDated"
              month="long"
              day="2-digit"
              :locale="seoConfig.site.lang"
              year="numeric"
            />
          </span>
          <BreadcrumbsLayout
            v-if="breadcrumbs.length"
            :breadcrumbs="breadcrumbs"
          ></BreadcrumbsLayout>
          <PostButtonRef
            v-if="isAllow"
            :size="'big'"
            :slug="seoConfig.site.brandSlug"
            position="left"
            >{{ seoConfig.translates.playNow }}</PostButtonRef
          >
        </div>
        <PostSections
          :sections="sections"
          :slug="slug"
        />
      </template>
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
import BreadcrumbsLayout from "#rc/components/layout/BreadcrumbsLayout.vue";
import RuntimeTemplateLayout from "#rc/components/layout/RuntimeTemplateLayout.vue";
import PostSections from "#rc/components/post/PostSections.vue";
import PostButtonRef from "#rc/components/post/PostButtonRef.vue";
import ButtonFastUpLayout from "#rc/components/layout/ButtonFastUpLayout.vue";
import { seoConfig } from "@@/seo.conf";
import { getCloudinaryBaseUrl } from "#rc/utils/get-cloudinary-base-url";
import { logoSize } from "#rc/utils/logo-size";

const {
  createdAt,
  updatedAt,
  content,
  sections,
  slug,
  metaTags,
  title,
  postDated,
  breadcrumbs,
} = usePost();

const isAllow = computed(() => breadcrumbs.value.length === 0);

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

// Высота в трансформации Cloudinary берётся из того же расчёта, что и атрибуты:
// у широкого лого logoSize сажает высоту ниже запрошенной, и захардкоженный
// h_45 разошёлся бы с объявленными размерами картинки.
const publisherLogo = computed(() => {
  if (!seoConfig.logo.src) {
    return null;
  }

  const size = logoSize(45, 200);

  return {
    "@type": "ImageObject",
    url: `${CLOUDINARY_BASE_URL.value}f_auto,q_auto,r_15,h_${size.height}/${seoConfig.logo.src}`,
    ...size,
  };
});

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
      ...(publisherLogo.value ? { logo: publisherLogo.value } : {}),
    },
  },
]);
</script>
