import { Schema } from "mongoose";
import { BookmakerModel } from "../bookmaker.model";
import { BonusModel } from "../bonus.model";
export const BookmakerBonusesSchema = [
  {
    _id: false,
    data: {
      _id: false,
      uniqId: {
        type: String,
        required: true,
        trim: true,
      },
      data: [
        {
          _id: false,
          entity: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: BookmakerModel.modelName,
          },
          bonuses: {
            type: [Schema.Types.ObjectId],
            required: true,
            ref: BonusModel.modelName,
            default: [],
          },
        },
      ],
    },
  },
];
