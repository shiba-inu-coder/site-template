import type { ObjectId } from "mongoose";

// Запись в базе может не покрывать дерево целиком: панель пишет её по частям,
// а образ может знать ключ, которого там ещё нет. Массив остаётся массивом —
// половины списка меню не бывает, он либо есть целиком, либо его нет.
export type DeepPartial<T> = T extends (infer U)[]
  ? U[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export type ObjectIdToStr<T> = T extends ObjectId
  ? string
  : T extends (infer U)[]
    ? ObjectIdToStr<U>[]
    : T extends object
      ? { [K in keyof T]: ObjectIdToStr<T[K]> }
      : T;
