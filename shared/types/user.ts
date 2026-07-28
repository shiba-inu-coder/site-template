import type { Model, ObjectId, Document } from "mongoose";

export interface IUser {
  _id: ObjectId;
  email: string;
  username: string;
  password: string;
}

export interface IUserDocument extends Omit<IUser, "_id">, Document<ObjectId> {}

export type IUserModel = Model<IUser>;
