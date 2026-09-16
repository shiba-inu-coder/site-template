import { model, Schema } from "mongoose";
import {
  EntityModel,
  type ISettingDocument,
  type ISettingModel,
} from "#shared/types";
import { RedirectsRoutesSchema } from "./schemas/RedirectsRoutes";
import { BrandSchema } from "./schemas/Brand";
import { LayoutSchema } from "./schemas/Layout";
import { StringsSchema } from "./schemas/Strings";
import { PreviewGrantSchema } from "./schemas/PreviewGrant";
import { UiThemeSchema } from "./schemas/UiTheme";

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
    brand: {
      type: BrandSchema,
      default: () => ({}),
    },
    layout: {
      type: LayoutSchema,
      default: () => ({}),
    },
    strings: {
      type: StringsSchema,
      default: () => ({}),
    },
    previewGrants: {
      type: [PreviewGrantSchema],
      default: () => [],
    },
    uiTheme: {
      type: UiThemeSchema,
      default: () => ({}),
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
