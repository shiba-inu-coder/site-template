import { model, Schema } from "mongoose";
import {
  EntityModel,
  type IGameTypeDocument,
  type IGameTypeModel,
} from "#shared/types";

const ModelSchema = new Schema<IGameTypeDocument, IGameTypeModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

ModelSchema.index({ title: 1 });

export const GameTypeModel: IGameTypeModel = model<
  IGameTypeDocument,
  IGameTypeModel
>(EntityModel.GameType, ModelSchema);
