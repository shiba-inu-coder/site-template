export const isDev = process.env.NODE_ENV === "development";

export const CLOUDINARY_CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME || "duhutcvan";
export const PostSlugRegex =
  /^[a-z0-9]+(?:-[a-z0-9]+)*(\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;
