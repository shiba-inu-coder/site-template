import { Schema } from "mongoose";
import { CasinoModel } from "../casino.model";
import { BonusModel } from "../bonus.model";
export const MiniCasinoReviewSchema = [
  {
    _id: false,
    data: {
      _id: false,
      uniqId: {
        type: String,
        required: true,
        trim: true,
      },
      title: {
        type: String,
        required: true,
        trim: true,
      },
      text: {
        type: String,
        required: true,
        trim: true,
      },
      entity: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: CasinoModel.modelName,
      },
      bonuses: {
        type: [Schema.Types.ObjectId],
        ref: BonusModel.modelName,
        default: [],
      },
      img: {
        _id: false,
        src: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          required: true,
        },
        width: {
          type: String,
          required: true,
        },
        height: {
          type: String,
          required: true,
        },
        format: {
          type: String,
          default: "auto",
        },
        roundCorner: {
          type: String,
          default: "0",
        },
      },
      prosCons: {
        prosList: {
          type: [String],
          default: [],
        },
        consList: {
          type: [String],
          default: [],
        },
      },
    },
  },
];
