import { model, Schema, Types } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

import { EntityModel } from "#shared/types";
import { PaymentMethodModel } from "./payment-method.model";
import { SportModel } from "./sport.model";
import { BonusModel } from "./bonus.model";

const ModelSchema = new Schema<IBookmakerDocument, IBookmakerModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: {
        path: {
          type: String,
          trim: true,
          default: "",
        },
        alt: {
          type: String,
          trim: true,
          default: "",
        },
      },
      required: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    refLink: {
      type: String,
      default: "",
      trim: true,
    },
    benefits: {
      type: [String],
      default: [],
    },
    topFeature: {
      type: String,
      default: "",
      trim: true,
    },
    bonus: {
      type: String,
      default: "",
      trim: true,
    },
    ribbon: {
      type: String,
      default: "",
      trim: true,
    },
    sports: {
      type: [{ type: Types.ObjectId, ref: SportModel.modelName }],
      default: [],
    },
    paymentMethods: {
      type: [{ type: Types.ObjectId, ref: PaymentMethodModel.modelName }],
      default: [],
    },
    bonuses: {
      type: [Schema.Types.ObjectId],
      ref: BonusModel.modelName,
      default: [],
    },
    payoutsSpeed: {
      type: String,
      default: "",
      trim: true,
    },
    yearEstablished: {
      type: String,
      default: "",
    },
    mobileApps: {
      type: [String],
      default: [],
    },
    minimumDeposit: {
      type: String,
      default: "",
      trim: true,
    },
    licence: {
      type: String,
      default: "",
      trim: true,
    },
    termsCondition: {
      type: String,
      default: "",
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

ModelSchema.plugin(uniqueValidator, {
  message:
    "Please update ‘{PATH}’ with a unique value or review the archived table.",
});

export const BookmakerModel: IBookmakerModel = model<
  IBookmakerDocument,
  IBookmakerModel
>(EntityModel.Bookmaker, ModelSchema);
