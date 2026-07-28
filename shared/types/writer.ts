import type { Model, ObjectId } from "mongoose";

export interface IWriter {
  _id: ObjectId;
  username: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: {
    alt: string;
    path: string;
  };
  position: string;
  info: string;
  createdAt: Date;
  updatedAt: Date;
}
export type InputWriter = Omit<
  IWriter,
  "id" | "_id" | "createdAt" | "updatedAt"
>;

export type IWriterModel = Model<IWriter>;
