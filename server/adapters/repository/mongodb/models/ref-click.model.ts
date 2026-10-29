import { model, Schema } from "mongoose";
import { EntityModel } from "#shared/types";

// Строка на (домен, день). `_id` — составной ключ (`refClickKey`): в проде
// `autoIndex` и `autoCreate` выключены, индекса по паре не будет. Коллекцию
// создаёт первый upsert сам, `autoCreate: false` ему не мешает.
const ModelSchema = new Schema<IRefClickDocument>(
  {
    _id: { type: String, required: true },
    domain: { type: String, required: true },
    day: { type: String, required: true },
    count: { type: Number, default: 0 },
  },
  {
    timestamps: false,
    strict: true,
  },
);

export const RefClickModel = model<IRefClickDocument>(
  EntityModel.RefClick,
  ModelSchema,
);
