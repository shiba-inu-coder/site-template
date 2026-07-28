import { Schema } from "mongoose";

export const BannerSchema = new Schema(
  {
    ribbon: { type: String, default: "", trim: true },
    text: { type: String, default: "", trim: true },
    entity: {
      type: Schema.Types.ObjectId,
      required: false,
      refPath: "banner.entityModel",
    },
    entityModel: {
      type: String,
      required: false,
      trim: true,
      enum: [
        "Casino",
        "Bookmaker",
        "PaymentMethod",
        "SoftwareProvider",
        "GameType",
      ],
    },
  },
  { _id: false },
);
