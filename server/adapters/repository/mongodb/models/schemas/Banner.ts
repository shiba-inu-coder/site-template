import { Schema } from "mongoose";

export const BannerSchema = new Schema(
  {
    ribbon: { type: String, default: "", trim: true },
    text: { type: String, default: "", trim: true },
    buttonText: { type: String, default: "", trim: true },
    img: {
      type: new Schema(
        {
          path: { type: String, default: "", trim: true },
          alt: { type: String, default: "", trim: true },
          width: { type: Number },
          height: { type: Number },
        },
        { _id: false },
      ),
      required: false,
    },
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
