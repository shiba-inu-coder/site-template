import type { Document, Model, ObjectId } from "mongoose";

export interface ISoftwareProvider {
  _id: ObjectId;
  title: string;
  logo: {
    alt: string;
    path: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type InputSoftwareProvider = Omit<
  ISoftwareProvider,
  "id" | "_id" | "createdAt" | "updatedAt"
>;

export interface ISoftwareProviderDocument
  extends Omit<ISoftwareProvider, "_id">,
    Document<ObjectId> {}

export type ISoftwareProviderModel = Model<ISoftwareProvider>;
