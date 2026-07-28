import { model, Schema } from "mongoose";

const ModelSchema = new Schema<IBonusDocument, IBonusModel>(
  {
    title: {
      type: String,
      default: "",
      trim: true,
    },
    text: {
      type: String,
      default: "",
      trim: true,
    },
    wager: {
      type: String,
      default: "",
      trim: true,
    },
    maxCashout: {
      type: String,
      default: "",
      trim: true,
    },
    minDeposit: {
      type: String,
      default: "",
      trim: true,
    },
    entity: {
      type: Schema.Types.ObjectId,
      required: false,
      refPath: "entityModel",
    },
    entityModel: {
      type: String,
      required: false,
      trim: true,
      enum: [EntityModel.Casino, EntityModel.Bookmaker],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export const BonusModel: IBonusModel = model<IBonusDocument, IBonusModel>(
  EntityModel.Bonus,
  ModelSchema,
);
