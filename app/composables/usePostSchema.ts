import { getCloudinaryBaseUrl } from "#rc/utils/get-cloudinary-base-url";
import { logoSize } from "#rc/utils/logo-size";
import { resolvePageLang } from "#shared/utils/site-config";

// schema.org страницы живёт здесь, а не в `BasePostView`: свой `brand/Hero.vue`
// и прочая кастомная вёрстка к разметке не прикасаются.
export const usePostSchema = () => {
  const { createdAt, updatedAt, metaTags, title } = usePost();
  const siteConfig = useSiteConfig();

  const SITE_URL = computed(() => useRuntimeConfig().public.SITE_URL);
  const CLOUDINARY_BASE_URL = computed(() =>
    getCloudinaryBaseUrl(useRuntimeConfig().public.CLOUDINARY_CLOUD_NAME),
  );
  const DOMAIN_NAME = computed(() => useRuntimeConfig().public.DOMAIN_NAME);
  const articleUrl = computed(() => `${SITE_URL.value}${useRoute().path}`);
  const websiteId = computed(() => `${SITE_URL.value}#website`);
  const webpage = computed(() => `${articleUrl.value}#webpage`);
  const article = computed(() => `${articleUrl.value}#article`);
  const pageLang = computed(() =>
    resolvePageLang(metaTags.value, siteConfig.value.site),
  );

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
      inLanguage: pageLang.value,
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
      inLanguage: pageLang.value,

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
};
