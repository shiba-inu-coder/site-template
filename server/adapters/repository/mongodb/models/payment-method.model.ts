import { model, Schema } from "mongoose";
import {
  EntityModel,
  type IPaymentMethodDocument,
  type IPaymentMethodModel,
} from "#shared/types";

const ModelSchema = new Schema<IPaymentMethodDocument, IPaymentMethodModel>(
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

export const PaymentMethodModel: IPaymentMethodModel = model<
  IPaymentMethodDocument,
  IPaymentMethodModel
>(EntityModel.PaymentMethod, ModelSchema);
