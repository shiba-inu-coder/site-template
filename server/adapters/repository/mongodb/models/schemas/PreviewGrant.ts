import { Schema } from "mongoose";

/**
 * Пропуск на стейджинг-сайт, выданный из панели.
 *
 * Живёт в настройках, а не в конфиге контейнера: конфиг читается один раз при
 * старте, и погашенный пропуск работал бы до перезапуска сервиса. Здесь же
 * список сверяется на каждом открытии черновика, и «погасить» действует сразу.
 *
 * `id` — он же секрет в адресе. Страницу пропуск не различает: он на весь сайт.
 */
export const PreviewGrantSchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: () => new Date() },
    createdBy: { type: String, default: "", trim: true },
  },
  { _id: false },
);
