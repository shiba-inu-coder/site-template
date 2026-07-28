import { seoConfig } from "@@/seo.conf";

export const useMetaHead = () => {
  const route = useRoute();
  const { metaTags, isActive } = usePost();
  const SITE_URL = useRuntimeConfig().public.SITE_URL;

  const PATH = route.path.toLowerCase().replace("/", "");
  const FULL_PATH = `${SITE_URL}/${PATH}`;

  const link: any[] = [
    { rel: "canonical", href: metaTags.value?.canonical || FULL_PATH },
  ];

  const alts = metaTags.value?.alternates.map((a) => ({
    rel: "alternate",
    hreflang: a.hreflang,
    href: a.href,
  }));

  link.push(...alts);

  const headConfig = computed(() => {
    const meta = [];
    if (metaTags.value?.description) {
      meta.push({
        name: "description",
        content: metaTags.value.description,
      });
    }
    if (metaTags.value?.keyword) {
      meta.push({
        name: "keywords",
        content: metaTags.value.keyword,
      });
    }

    if (isActive.value) {
      if (metaTags.value?.robots) {
        meta.push({
          name: "robots",
          content: metaTags.value.robots,
        });
      }
    } else {
      meta.push({
        name: "robots",
        content: "noindex, nofollow",
      });
    }
    return {
      title: metaTags.value?.title ? metaTags.value.title : seoConfig.site.name,
      htmlAttrs: { lang: metaTags.value.lang || seoConfig.site.lang },
      meta,
      link,
    };
  });

  useHead(headConfig.value);
};
