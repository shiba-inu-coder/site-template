import type { Document, Model, ObjectId } from "mongoose";

export interface ICasino<
  G = ObjectId,
  S = ObjectId,
  P = ObjectId,
  RR = ObjectId,
  B = ObjectId,
> {
  _id: ObjectId;
  title: string;
  logo: {
    path: string;
    alt: string;
  };
  refLink: string;
  website: string;
  owner: string;
  languages: string;
  safety: {
    ssl: boolean;
    responsibleGambling: boolean;
    depositLimits: boolean;
    lossLimits: boolean;
    timeLimits: boolean;
    selfExclusionTool: boolean;
  };
  isVipProgram: boolean;
  rating: number;
  slug: string;
  prosList: string[];
  consList: string[];
  gameTypes: G[];
  softwareProviders: S[];
  paymentMethods: P[];
  numberCasinosGame: string;
  ribbon: string;
  payoutsSpeed: string;
  yearEstablished: string;
  minimumDeposit: string;
  licence: string;
  maximumCashout: string;
  reviewPost?: RR;
  sportsBetting: boolean;
  customerServices: string[];
  bonuses: B[];
  closedYear: string;
  mobileApps: string[];
  benefits: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type InputCasino<G = ObjectId, S = ObjectId, P = ObjectId> = Omit<
  ICasino<G, S, P>,
  "id" | "_id" | "createdAt" | "updatedAt"
>;

export interface ICasinoDocument
  extends Omit<ICasino, "_id">,
    Document<ObjectId> {}

export type ICasinoModel = Model<ICasino>;
