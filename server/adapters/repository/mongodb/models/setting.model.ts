import { model, Schema } from "mongoose";
import {
  EntityModel,
  type ISettingDocument,
  type ISettingModel,
} from "#shared/types";
import { RedirectsRoutesSchema } from "./schemas/RedirectsRoutes";
import { HeaderLinkSchema } from "./schemas/HeaderLink";

const ModelSchema = new Schema<ISettingDocument, ISettingModel>(
  {
    robotsTXT: {
      type: String,
      default: "",
      trim: true,
    },
    externalSitemapUrl: {
      type: String,
      default: "",
      trim: true,
    },
    redirectsRoutes: RedirectsRoutesSchema,
    headerLinks: {
      type: [HeaderLinkSchema],
      default: () => [],
    },
  },
  {
    timestamps: false,
    strict: true,
  },
);

ModelSchema.statics.findOneOrCreate = async function () {
  try {
    const settings = await this.findOne({});
    if (settings) {
      return settings;
    } else {
      return await this.create({});
    }
  } catch (error) {
    throw error;
  }
};
ModelSchema.statics.updateOrCreate = async function updateOrCreate(values) {
  const doc = await this.findOneAndUpdate({}, values, {
    new: true,
    upsert: true,
    runValidators: true,
    overwrite: false,
  });

  return doc;
};

export const SettingModel: ISettingModel = model<
  ISettingDocument,
  ISettingModel
>(EntityModel.Setting, ModelSchema);
