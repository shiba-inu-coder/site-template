import type { ObjectId } from "mongoose";

export type ObjectIdToStr<T> = T extends ObjectId
  ? string
  : T extends (infer U)[]
    ? ObjectIdToStr<U>[]
    : T extends object
      ? { [K in keyof T]: ObjectIdToStr<T[K]> }
      : T;
