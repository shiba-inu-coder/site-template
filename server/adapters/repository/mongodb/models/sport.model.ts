import { model, Schema } from "mongoose";
import {
  EntityModel,
  type ISportDocument,
  type ISportModel,
} from "#shared/types";

const ModelSchema = new Schema<ISportDocument, ISportModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

ModelSchema.index({ title: 1 });

export const SportModel: ISportModel = model<ISportDocument, ISportModel>(
  EntityModel.Sport,
  ModelSchema,
);
