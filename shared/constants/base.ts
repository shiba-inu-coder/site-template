export const isDev = process.env.NODE_ENV === "development";

// @nuxt/image бакает baseURL провайдера в сборку — переменной без значения
// сайт молча уехал бы на чужое Cloudinary-облако вместо явного падения.
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error("CLOUDINARY_CLOUD_NAME is not set");
}

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const PostSlugRegex =
  /^[a-z0-9]+(?:-[a-z0-9]+)*(\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;
