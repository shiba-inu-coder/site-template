import type { Document, Model, ObjectId } from "mongoose";

export interface IGameType {
  _id: ObjectId;
  title: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type InputGameType = Omit<
  IGameType,
  "id" | "_id" | "createdAt" | "updatedAt"
>;

export interface IGameTypeDocument
  extends Omit<IGameType, "_id">,
    Document<ObjectId> {}

export type IGameTypeModel = Model<IGameType>;
