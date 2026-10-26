import { Schema } from "mongoose";

// Ключи кнопок содержат точку (`lobby.gates-of-olympus`), а `Map` в Mongoose
// такие ключи не принимает — поэтому Mixed.
export const RefsSchema = new Schema(
  {
    defaultSlug: { type: String, default: "", trim: true },
    blocks: { type: Schema.Types.Mixed, default: () => ({}) },
    buttons: { type: Schema.Types.Mixed, default: () => ({}) },
  },
  { _id: false, minimize: false },
);
