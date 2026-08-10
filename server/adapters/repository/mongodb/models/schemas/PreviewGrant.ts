import { Schema } from "mongoose";

/**
 * Именная ссылка на черновик, выданная из панели.
 *
 * Живёт в настройках, а не в конфиге контейнера: конфиг читается один раз при
 * старте, и погашенная ссылка работала бы до перезапуска сервиса. Здесь же
 * список сверяется на каждом открытии черновика, и «погасить» действует сразу.
 *
 * `id` — он же секрет в адресе, `slug` привязывает ссылку к одной странице.
 */
export const PreviewGrantSchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    name: { type: String, default: "", trim: true },
    slug: { type: String, required: true, trim: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: () => new Date() },
    createdBy: { type: String, default: "", trim: true },
  },
  { _id: false },
);
