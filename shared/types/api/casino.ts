import type { ObjectId } from "mongoose";

export type CasinoReponseGetAll = AdvancedSearchResponse<
  Pick<ICasino, "title" | "logo" | "isDeleted" | "updatedAt">
>;

export type RatingCasinosShortcode = Pick<
  ICasino<
    ObjectId,
    ObjectId,
    ObjectId,
    ObjectId,
    ObjectIdToStr<Pick<IBonus, "text" | "title" | "_id">>
  >,
  "title" | "logo" | "bonuses"
> & { _id: string };

export interface ICasinoRepository {
  getAll(query: AdvancedSearchQuery, isDeleted: boolean): CasinoReponseGetAll;
  getById(id: string): Promise<ICasino>;
  getBySlug(slug: string): Promise<ICasino>;
  getOptions(param?: { label: string; value: string }): Promise<Option[]>;
  create(input: InputCasino): Promise<ICasino>;
  update(id: string, input: InputCasino): Promise<ICasino>;
  partialUpdate(id: string, input: Partial<InputCasino>): Promise<ICasino>;
  delete(id: string): Promise<boolean>;
  archive(id: string): Promise<boolean>;
  unarchive(id: string): Promise<boolean>;
  addBonus(casinoId: ObjectId, bonusId: ObjectId): Promise<void>;
  removeBonus(casinoId: ObjectId, bonusId: ObjectId): Promise<void>;
  getAllForShortcode(): Promise<RatingCasinosShortcode[]>;
}

export interface ICasinoUsecase {
  getAll(query: AdvancedSearchQuery): CasinoReponseGetAll;
  getAllArchived(query: AdvancedSearchQuery): CasinoReponseGetAll;
  getOptions(param?: { label: string; value: string }): Promise<Option[]>;
  create(data: InputCasino): Promise<ICasino>;
  getById(id: string): Promise<ICasino>;
  update(id: string, data: InputCasino): Promise<ICasino>;
  partialUpdate(id: string, input: Partial<InputCasino>): Promise<ICasino>;
  delete(id: string): Promise<boolean>;
  archive(id: string): Promise<boolean>;
  unarchive(id: string): Promise<boolean>;
  getAllForShortcode(): Promise<RatingCasinosShortcode[]>;
}
