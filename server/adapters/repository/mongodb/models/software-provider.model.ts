import { model, Schema } from "mongoose";
import {
  EntityModel,
  type ISoftwareProviderDocument,
  type ISoftwareProviderModel,
} from "#shared/types";

const ModelSchema = new Schema<
  ISoftwareProviderDocument,
  ISoftwareProviderModel
>(
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
  },
  {
    timestamps: true,
    strict: true,
  },
);

ModelSchema.index({ title: 1 });

export const SoftwareProviderModel: ISoftwareProviderModel = model<
  ISoftwareProviderDocument,
  ISoftwareProviderModel
>(EntityModel.SoftwareProvider, ModelSchema);
