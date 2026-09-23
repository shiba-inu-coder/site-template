import { Schema } from "mongoose";

export const FrameSchema = new Schema(
  {
    hero: { type: String, required: false, trim: true },
    sidebar: { type: String, required: false, trim: true },
    width: { type: String, required: false, trim: true },
    sticky: { type: String, required: false, trim: true },
  },
  { _id: false },
);
