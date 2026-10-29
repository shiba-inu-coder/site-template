import type { Document } from "mongoose";

export interface IRefClick {
  _id: string;
  domain: string;
  day: string;
  count: number;
}

export interface IRefClickDocument extends Omit<IRefClick, "_id">, Document {
  _id: string;
}

export interface IRefClickRepository {
  increment(domain: string, day: string): Promise<void>;
}
