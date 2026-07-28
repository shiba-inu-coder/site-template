import type { Document, Model, ObjectId } from "mongoose";

export interface IBookmaker<P = ObjectId, S = ObjectId, B = ObjectId> {
  _id: ObjectId;
  title: string;
  logo: {
    alt: string;
    path: string;
  };
  rating: number;
  refLink: string;
  slug: string;
  bonus: string;
  ribbon: string;
  benefits: string[];
  topFeature: string;
  paymentMethods: P[];
  sports: S[];
  bonuses: B[];
  payoutsSpeed: string;
  yearEstablished: string;
  mobileApps: string[];
  minimumDeposit: string;
  licence: string;
  termsCondition: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type InputBookmaker<P = ObjectId> = Omit<
  IBookmaker<P>,
  "id" | "_id" | "createdAt" | "updatedAt"
>;

export interface IBookmakerDocument
  extends Omit<IBookmaker, "_id">,
    Document<ObjectId> {}

export type IBookmakerModel = Model<IBookmaker>;
