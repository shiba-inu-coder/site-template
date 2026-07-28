import { Schema } from "mongoose";
import { CasinoModel } from "../casino.model";
import { BonusModel } from "../bonus.model";
export const CasinoBonusesSchema = [
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
            ref: CasinoModel.modelName,
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
