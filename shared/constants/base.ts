export const isDev = process.env.NODE_ENV === "development";

// Единственное значение конфигурации, оставшееся на сборке. @nuxt/image печёт
// baseURL провайдера в build-модуль — в runtimeConfig от него уезжает только
// ipx, — а само имя облака не секрет: оно стоит в каждом URL картинки. Аккаунт
// Cloudinary один на все сайты, поэтому здесь литерал, а не переменная.
export const CLOUDINARY_CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME || "duhutcvan";
export const PostSlugRegex =
  /^[a-z0-9]+(?:-[a-z0-9]+)*(\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;

export const TimeoutLoadingGAandGTM = 3000; // 3 seconds

export const refLinkTypes = [
  {
    label: "Casino",
    value: "casino",
  },
  {
    label: "Bookmaker",
    value: "bookmaker",
  },
];
