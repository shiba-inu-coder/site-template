import { Schema } from "mongoose";

const LogoSchema = new Schema(
  {
    src: { type: String, default: "", trim: true },
    alt: { type: String, default: "", trim: true },
    // Собственные размеры файла: отрисовка идёт по высоте, ширина считается
    // отсюда (`app/utils/logo-size.ts`).
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
  },
  { _id: false },
);

// Фавикон приезжает public id Cloudinary, а не файлом в репозитории: панель
// больше не коммитит `public/favicon.ico`.
const FaviconSchema = new Schema(
  {
    src: { type: String, default: "", trim: true },
  },
  { _id: false },
);

export const BrandSchema = new Schema(
  {
    name: { type: String, default: "", trim: true },
    lang: { type: String, default: "", trim: true },
    brandSlug: { type: String, default: "", trim: true },
    logo: { type: LogoSchema, default: () => ({}) },
    favicon: { type: FaviconSchema, default: () => ({}) },
    imgRoundCorner: { type: String, default: "", trim: true },
  },
  { _id: false },
);
