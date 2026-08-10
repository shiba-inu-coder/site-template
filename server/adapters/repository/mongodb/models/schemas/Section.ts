import { Schema } from "mongoose";

/**
 * Секция статьи из конструктора AppsPro. Зеркало `SectionSchema` там же —
 * панель пишет сюда напрямую при публикации, и лишнее поле с одной стороны
 * просто не доедет до другой.
 *
 * `layout` объявлен отдельной схемой с `_id: false`, а не объектным литералом:
 * литерал регистрируется путями вида `layout.width`, и запись, отфильтрованная
 * по путям верхнего уровня, потеряла бы его целиком. Той же ловушкой в AppsPro
 * объясняются `metaTag` и `introImg`.
 */
const SectionBgSchema = new Schema(
  {
    token: { type: String, default: "", trim: true },
    hex: { type: String, default: "", trim: true },
    opacity: { type: Number, default: 100 },
  },
  { _id: false },
);

const SectionImageSchema = new Schema(
  {
    path: { type: String, default: "", trim: true },
    alt: { type: String, default: "", trim: true },
    overlay: { type: Number, default: 0 },
  },
  { _id: false },
);

const SectionLayoutSchema = new Schema(
  {
    width: { type: String, default: "container", trim: true },
    bg: { type: SectionBgSchema, default: () => ({}) },
    image: { type: SectionImageSchema, default: () => ({}) },
    padding: { type: String, default: "md", trim: true },
  },
  { _id: false },
);

const SectionChildSchema = new Schema(
  {
    tag: { type: String, default: "h3", trim: true },
    title: { type: String, default: "", trim: true },
    comment: { type: String, default: "", trim: true },
  },
  { _id: false },
);

export const SectionSchema = new Schema(
  {
    uid: { type: String, default: "", trim: true },
    title: { type: String, default: "", trim: true },
    // Бриф и план подзаголовков читателю не показываются: они нужны только
    // конструктору, чтобы секцию можно было перегенерировать поодиночке.
    comment: { type: String, default: "", trim: true },
    children: { type: [SectionChildSchema], default: () => [] },
    body: { type: String, default: "" },
    blocks: { type: [String], default: () => [] },
    layout: { type: SectionLayoutSchema, default: () => ({}) },
  },
  { _id: false },
);
