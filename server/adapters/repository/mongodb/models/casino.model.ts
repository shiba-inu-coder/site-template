import { model, Schema, Types } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

import { EntityModel } from "#shared/types";
import { GameTypeModel } from "./game-type.model";
import { PaymentMethodModel } from "./payment-method.model";
import { SoftwareProviderModel } from "./software-provider.model";
import { BonusModel } from "./bonus.model";

const ModelSchema = new Schema<ICasinoDocument, ICasinoModel>(
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
    ribbon: {
      type: String,
      default: "",
      trim: true,
    },
    refLink: {
      type: String,
      default: "",
      trim: true,
    },
    maximumCashout: {
      type: String,
      default: "",
      trim: true,
    },
    website: {
      type: String,
      default: "",
      trim: true,
    },
    owner: {
      type: String,
      default: "",
      trim: true,
    },
    languages: {
      type: String,
      default: "",
      trim: true,
    },
    safety: {
      ssl: { type: Boolean, default: false },
      responsibleGambling: { type: Boolean, default: false },
      depositLimits: { type: Boolean, default: false },
      lossLimits: { type: Boolean, default: false },
      timeLimits: { type: Boolean, default: false },
      selfExclusionTool: { type: Boolean, default: false },
    },
    licence: {
      type: String,
      default: "",
      trim: true,
    },
    prosList: {
      type: [String],
      default: [],
    },
    consList: {
      type: [String],
      default: [],
    },
    isVipProgram: {
      type: Boolean,
      default: false,
    },
    sportsBetting: {
      type: Boolean,
      default: false,
    },
    gameTypes: {
      type: [{ type: Types.ObjectId, ref: GameTypeModel.modelName }],
      default: [],
    },
    softwareProviders: {
      type: [{ type: Types.ObjectId, ref: SoftwareProviderModel.modelName }],
      default: [],
    },
    paymentMethods: {
      type: [{ type: Types.ObjectId, ref: PaymentMethodModel.modelName }],
      default: [],
    },
    numberCasinosGame: {
      type: String,
      default: "",
      trim: true,
    },
    benefits: {
      type: [String],
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
      trim: true,
    },
    minimumDeposit: {
      type: String,
      default: "",
      trim: true,
    },
    mobileApps: {
      type: [String],
      default: [],
    },
    customerServices: {
      type: [String],
      default: [],
    },
    closedYear: {
      type: String,
      default: "",
      trim: true,
    },
    reviewPost: {
      type: Types.ObjectId,
      ref: EntityModel.Post,
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

ModelSchema.index({ title: 1, rating: 1, isDeleted: 1 });

ModelSchema.plugin(uniqueValidator, {
  message:
    "Please update ‘{PATH}’ with a unique value or review the archived table.",
});

export const CasinoModel: ICasinoModel = model<ICasinoDocument, ICasinoModel>(
  EntityModel.Casino,
  ModelSchema,
);
