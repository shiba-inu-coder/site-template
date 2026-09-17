import { CLOUDINARY_CLOUD_NAME, isDev } from "./shared/constants/base";
import tailwindcss from "@tailwindcss/vite";
import { getCloudinaryBaseUrl } from "./app/utils/get-cloudinary-base-url";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";
import { defineNuxtConfig } from "nuxt/config";

function getCurrentDirectory(p: string) {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  return join(currentDir, p);
}

// Рантайм-образ (Dockerfile, stage `runner`) не копирует исходники — только
// package.json, .output и docker/*.mjs. TEMPLATE_VERSION попадает в
// работающий сервер только так: значение читается на сборке и печётся в
// runtimeConfig, как CLOUDINARY_CLOUD_NAME чуть выше.
const TEMPLATE_VERSION = readFileSync(
  getCurrentDirectory("./TEMPLATE_VERSION"),
  "utf-8",
).trim();

export default defineNuxtConfig({
  app: {
    head: {
      // Язык, тема и `color-scheme` живут в `app/plugins/ui-theme.ts`: их
      // значение приходит из базы в рантайме, а сюда попало бы только то, что
      // знала о сайте машина сборки.
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

  hooks: {
    // @nuxtjs/sitemap и nuxt-schema-org оба объявляют moduleDependencies на
    // nuxt-site-config, из-за чего Nuxt настраивает его дважды и он
    // автоимпортирует свой `useSiteConfig` (с тем же именем, что и проектный
    // из app/composables/useSiteConfig.ts) в composablesDirs двумя копиями. У
    // обеих приоритет по умолчанию (1) выше, чем у отсканированного из
    // app/-слоя (0) — модульный побеждает всегда, siteConfig.value становится
    // undefined везде, где ждут проектный SiteConfig. Вырезаем обе копии, а не
    // переименовываем ~40 мест использования.
    "imports:extend"(autoImports) {
      for (let i = autoImports.length - 1; i >= 0; i--) {
        if (
          autoImports[i].name === "useSiteConfig" &&
          autoImports[i].from.includes("nuxt-site-config")
        )
          autoImports.splice(i, 1);
      }
    },
  },

  // Одно нейтральное семейство — дефолт шаблона и фолбэк. Пару шрифтов темы
  // (`type.display`/`type.body`) подключает ссылкой `app/plugins/ui-theme.ts`:
  // @nuxt/fonts сканирует CSS на сборке и о семействе из базы не знает.
  fonts: {
    families: [
      {
        name: "Inter",
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
    TEMPLATE_VERSION,
    site: {
      url: process.env.SITE_URL,
      name: process.env.DOMAIN_NAME,
    },
    public: {
      CLOUDINARY_CLOUD_NAME,
      SITE_URL: process.env.SITE_URL,
      DOMAIN_NAME: process.env.DOMAIN_NAME,
      PANEL_ORIGINS: process.env.PANEL_ORIGINS,
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
