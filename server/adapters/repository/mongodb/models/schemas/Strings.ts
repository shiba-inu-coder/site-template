import { Schema } from "mongoose";

/**
 * Дерево переводов интерфейса целиком. Ни один ключ не объявлен намеренно:
 * набор задаёт панель (`seo-conf-defaults.js`), она же добавляет туда новые, и
 * образ сайта обновляется не тем же деплоем. `strict: false` держит то, чего
 * эта сборка ещё не знает, вместо того чтобы молча выбросить.
 */
export const StringsSchema = new Schema(
  {},
  { _id: false, strict: false, minimize: false },
);
