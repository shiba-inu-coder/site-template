import { CLOUDINARY_CLOUD_NAME, isDev } from "./shared/constants/base";
import { seoConfig } from "./seo.conf";
import tailwindcss from "@tailwindcss/vite";
import { getCloudinaryBaseUrl } from "./app/utils/get-cloudinary-base-url";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { defineNuxtConfig } from "nuxt/config";

function getCurrentDirectory(p: string) {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  return join(currentDir, p);
}

export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: { lang: seoConfig.site.lang },
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1.0",
        },
        {
          name: "format-detection",
          content: "address=no, telephone=no, email=no, url=no, date=no",
        },
      ],
      link: [{ rel: "icon", href: "/favicon.ico" }],
    },
  },

  modules: [
    "@nuxtjs/sitemap",
    "nuxt-schema-org",
    "@nuxt/image",
    "@nuxt/eslint",
    "nuxt-vitalizer",
    "@nuxt/fonts",
    "nuxt-svg-sprite-icon",
  ],

  // @ts-expect-error nuxt fonst TS config type is wrong
  fonts: {
    families: [
      {
        name: "Lato",
        provider: "google",
        subsets: ["latin", "latin-ext"],
      },
    ],
    defaults: {
      styles: ["normal"],
      weights: [300, 400, 500, 600, 700],
    },
  },

  svgSprite: {
    input: "./app/assets/icons",
    output: "./app/assets/icons-gen",
    defaultSprite: "icons",
    elementClass: "svg-icon",
    optimize: false,
  },

  vitalizer: {
    disablePrefetchLinks: true,
    disablePreloadLinks: true,
    // if set 'entry' as result fonts download will be twice
    disableStylesheets: true,
  },

  // url и name живут не здесь, а в runtimeConfig.site: nuxt-site-config кладёт
  // значения из nuxt.config с приоритетом -3, а рантайм-конфиг подмешивает
  // свои с 0 и перебивает их. Так sitemap и schema-org получают домен из Vault,
  // а не тот, что был на машине сборки.
  site: {
    cacheTtl: 0,
    trailingSlash: true,
    xslTips: false,
    credits: false,
  },

  sitemap: {
    excludeAppSources: true,
    sources: ["/api/v1/public/seo/sitemap/"],
    cacheMaxAgeSeconds: 3600,
    xslColumns: [
      { label: "URL", width: "75%" },
      { label: "Last Modified", select: "sitemap:lastmod", width: "25%" },
    ],
  },

  image: {
    cloudinary: {
      baseURL: getCloudinaryBaseUrl(CLOUDINARY_CLOUD_NAME),
    },
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      "2xl": 1536,
    },
  },

  // Ключ, не объявленный здесь, невидим для useRuntimeConfig() — поэтому
  // каждый перечислен поимённо.
  runtimeConfig: {
    MONGO_URI: process.env.MONGO_URI,
    MONGO_DB_NAME: process.env.DB_NAME,
    CACHE_PURGE_SECRET: process.env.CACHE_PURGE_SECRET,
    PREVIEW_TOKEN: process.env.PREVIEW_TOKEN,
    site: {
      url: process.env.SITE_URL,
      name: process.env.DOMAIN_NAME,
    },
    public: {
      CLOUDINARY_CLOUD_NAME,
      SITE_URL: process.env.SITE_URL,
      DOMAIN_NAME: process.env.DOMAIN_NAME,
    },
  },

  typescript: {
    strict: false,
    typeCheck: true,
  },

  nitro: {
    debug: isDev,
    compressPublicAssets: false,
    minify: !isDev,
    storage: {
      fsApp: {
        driver: "fs",
        base: isDev ? "./.nuxt" : "./app-cache",
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  alias: {
    "#sg": getCurrentDirectory("./server"),
    "#rc": getCurrentDirectory("./app"),
  },

  vue: {
    runtimeCompiler: true,
  },

  devtools: { enabled: false },

  debug: isDev,

  future: {
    compatibilityVersion: 4,
  },

  components: false,

  features: {
    inlineStyles: true,
  },

  experimental: {
    sharedPrerenderData: true,
    defaults: {
      nuxtLink: {
        trailingSlash: "append",
      },
    },
  },

  compatibilityDate: "2025-11-17",
});
