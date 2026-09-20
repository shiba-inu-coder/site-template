<template>
  <div
    id="article"
    class="mt-18"
  >
    <slot>
      <template v-if="sections?.length">
        <HeroLayout v-if="heroEnabled"></HeroLayout>
        <div
          v-else
          class="px-2.5 md:px-4 xl:px-0 w-full max-w-7xl mx-auto"
        >
          <span
            v-if="postDated"
            class="text-step-8 text-ui-heading font-medium block"
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
          <BreadcrumbsLayout
            v-if="breadcrumbs.length"
            :breadcrumbs="breadcrumbs"
          ></BreadcrumbsLayout>
        </div>
        <div
          :class="
            hasSidebar
              ? 'md:grid md:grid-cols-[minmax(0,1fr)_300px] md:gap-8 md:max-w-7xl md:mx-auto md:px-4'
              : ''
          "
        >
          <PostSections
            :sections="sections"
            :slug="slug"
          />
          <AsideLayout
            v-if="hasSidebar"
            :show-offer="frame.sidebar === 'toc-offer'"
          ></AsideLayout>
        </div>
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
      <StickyCtaLayout
        v-if="stickyVariant !== 'none'"
        :variant="stickyVariant"
      ></StickyCtaLayout>
      <ButtonFastUpLayout></ButtonFastUpLayout>
    </slot>
  </div>
</template>
<script setup lang="ts">
import AsideLayout from "#rc/components/layout/AsideLayout.vue";
import BreadcrumbsLayout from "#rc/components/layout/BreadcrumbsLayout.vue";
import HeroLayout from "#rc/components/layout/HeroLayout.vue";
import RuntimeTemplateLayout from "#rc/components/layout/RuntimeTemplateLayout.vue";
import StickyCtaLayout from "#rc/components/layout/StickyCtaLayout.vue";
import PostSections from "#rc/components/post/PostSections.vue";
import ButtonFastUpLayout from "#rc/components/layout/ButtonFastUpLayout.vue";
import { getCloudinaryBaseUrl } from "#rc/utils/get-cloudinary-base-url";
import { logoSize } from "#rc/utils/logo-size";
import { pickVariant } from "#shared/utils/block-variant";

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

const siteConfig = useSiteConfig();
const { frame } = useUiTheme();
const { enabled: heroEnabled } = useHeroContent();

const hasSidebar = computed(() => (frame.value.sidebar || "none") !== "none");

const stickyVariant = computed(() =>
  pickVariant(["none", "bar", "button"] as const, "none", frame.value.sticky),
);

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
  const logo = siteConfig.value.logo;

  if (!logo.src) {
    return null;
  }

  const size = logoSize(logo, 45, 200);

  return {
    "@type": "ImageObject",
    url: `${CLOUDINARY_BASE_URL.value}f_auto,q_auto,r_15,h_${size.height}/${logo.src}`,
    ...size,
  };
});

useSchemaOrg([
  {
    "@type": "WebSite",
    "@id": websiteId.value,
    url: `${SITE_URL.value}/`,
    name: DOMAIN_NAME.value,
    inLanguage: siteConfig.value.site.lang,
  },
  {
    "@id": webpage.value,
    "@type": "WebPage",
    description: metaTags.value.description,
    name: siteConfig.value.site.name,
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
    inLanguage: siteConfig.value.site.lang,

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
