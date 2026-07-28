import type { Model, ObjectId, Document } from "mongoose";

export interface ISession {
  userId: ObjectId;
  refreshToken: string;
  fingerprint: string;
  expiresIn: Date;
}

export interface ISessionDocument extends Document, ISession {}

export type ISessionModel = Model<ISession>;

export interface IToken {
  accessToken: string;
  refreshToken: string;
}
