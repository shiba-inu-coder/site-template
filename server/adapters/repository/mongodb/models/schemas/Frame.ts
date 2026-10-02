import { Schema } from "mongoose";

export const FrameSchema = new Schema(
  {
    sticky: { type: String, required: false, trim: true },
  },
  { _id: false },
);
