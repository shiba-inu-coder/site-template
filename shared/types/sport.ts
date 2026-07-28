import type { Document, Model, ObjectId } from "mongoose";

export interface ISport {
  _id: ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InputSport = Omit<ISport, "id" | "_id" | "createdAt" | "updatedAt">;

export interface ISportDocument
  extends Omit<ISport, "_id">,
    Document<ObjectId> {}

export type ISportModel = Model<ISport>;
