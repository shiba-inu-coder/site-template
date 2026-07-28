import type { ObjectId } from "mongoose";

export type BookmakerReponseGetAll = AdvancedSearchResponse<
  Pick<IBookmaker, "title" | "logo" | "isDeleted" | "updatedAt">
>;

export type RatingBookmakersShortcode = Pick<
  IBookmaker<ObjectId, ObjectId, Pick<IBonus, "text" | "title">>,
  "title" | "logo" | "bonuses"
> & { _id: string };

export interface IBookmakerRepository {
  getAll(
    query: AdvancedSearchQuery,
    isDeleted: boolean,
  ): BookmakerReponseGetAll;
  getById(id: string): Promise<IBookmaker>;
  getBySlug(slug: string): Promise<IBookmaker>;
  getOptions(param?: { label: string; value: string }): Promise<Option[]>;
  create(input: InputBookmaker): Promise<IBookmaker>;
  update(id: string, input: InputBookmaker): Promise<IBookmaker>;
  partialUpdate(
    id: string,
    input: Partial<InputBookmaker>,
  ): Promise<IBookmaker>;
  delete(id: string): Promise<boolean>;
  archive(id: string): Promise<boolean>;
  unarchive(id: string): Promise<boolean>;
  addBonus(casinoId: ObjectId, bonusId: ObjectId): Promise<void>;
  removeBonus(casinoId: ObjectId, bonusId: ObjectId): Promise<void>;
  getAllForShortcode(): Promise<RatingBookmakersShortcode[]>;
}

export interface IBookmakerUsecase {
  getAll(query: AdvancedSearchQuery): BookmakerReponseGetAll;
  getAllArchived(query: AdvancedSearchQuery): BookmakerReponseGetAll;
  getOptions(param?: { label: string; value: string }): Promise<Option[]>;
  create(data: InputBookmaker): Promise<IBookmaker>;
  getById(id: string): Promise<IBookmaker>;
  update(id: string, data: InputBookmaker): Promise<IBookmaker>;
  partialUpdate(
    id: string,
    input: Partial<InputBookmaker>,
  ): Promise<IBookmaker>;
  delete(id: string): Promise<boolean>;
  archive(id: string): Promise<boolean>;
  unarchive(id: string): Promise<boolean>;
  getAllForShortcode(): Promise<RatingBookmakersShortcode[]>;
}
