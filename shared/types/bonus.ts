import type { Document, Model, ObjectId } from "mongoose";

export interface IBonus<Entity = ObjectId> {
  _id: ObjectId;
  title: string;
  text: string;
  wager: string;
  maxCashout: string;
  minDeposit: string;
  entity?: Entity;
  entityModel: EntityModel.Casino | EntityModel.Bookmaker;
  createdAt: Date;
  updatedAt: Date;
}
export type InputBonus = Omit<IBonus, "id" | "_id" | "createdAt" | "updatedAt">;

export interface IBonusDocument
  extends Omit<IBonus, "_id">,
    Document<ObjectId> {}

export type IBonusModel = Model<IBonus>;
