import type { Document, Model, ObjectId } from "mongoose";

export interface IPaymentMethod {
  _id: ObjectId;
  title: string;
  logo: {
    alt: string;
    path: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type InputPaymentMethod = Omit<
  IPaymentMethod,
  "id" | "_id" | "createdAt" | "updatedAt"
>;

export interface IPaymentMethodDocument
  extends Omit<IPaymentMethod, "_id">,
    Document<ObjectId> {}

export type IPaymentMethodModel = Model<IPaymentMethod>;
