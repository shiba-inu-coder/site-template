import type { ObjectId } from "mongoose";

export type IPostReponseGetAll = AdvancedSearchResponse<
  Pick<
    IPost,
    | "title"
    | "slug"
    | "isActive"
    | "entity"
    | "entityModel"
    | "updatedAt"
    | "isDeleted"
  >
>;

export type IPostBySlug<Entity = ObjectId> = Exclude<
  IPost<
    Entity,
    Pick<IWriter, "fullName" | "position" | "avatar" | "username" | "info">,
    Pick<IBonus, "title" | "text">,
    Pick<IBonus, "title" | "text">,
    Pick<IBonus, "title" | "text" | "wager" | "minDeposit">,
    Pick<ICasino, "title" | "logo" | "slug">,
    Pick<IBookmaker, "title" | "logo" | "slug">,
    Pick<
      ICasino<
        Pick<IGameType, "title">,
        ObjectId,
        Pick<IPaymentMethod, "title">
      >,
      | "paymentMethods"
      | "gameTypes"
      | "yearEstablished"
      | "licence"
      | "numberCasinosGame"
    >,
    Pick<
      IBookmaker<Pick<IPaymentMethod, "title">, Pick<ISport, "title">>,
      "paymentMethods" | "yearEstablished" | "licence" | "sports"
    >,
    PostCasinoRatingEntity,
    PostBookmakerRatingEntity,
    Pick<IBonus, "title" | "text">
  >,
  "_id"
>;

export interface IPostRepository {
  getAll(query: AdvancedSearchQuery, isDeleted: boolean): IPostReponseGetAll;
  getById(id: string): Promise<IPost>;
  getBySlug(id: string): Promise<IPostBySlug>;
  create(input: InputPost): Promise<IPost>;
  update(id: string, input: InputPost): Promise<IPost>;
  updatePartial(id: string, updateData: Partial<InputPost>): Promise<IPost>;
  delete(id: string): Promise<IPost>;
  getSitemap(): Promise<
    {
      loc: string;
      lastmod: Date;
      changefreq: string;
      priority: number;
    }[]
  >;

  getOptions(param?: { label: string; value: string }): Promise<Option[]>;
}

export interface IPostUsecasePrivate {
  getAll(query: AdvancedSearchQuery): IPostReponseGetAll;
  getAllArchived(query: AdvancedSearchQuery): IPostReponseGetAll;
  getById(id: string): Promise<IPost>;
  create(input: InputPost): Promise<IPost>;
  update(id: string, input: InputPost): Promise<IPost>;
  copyById(id: string): Promise<IPost>;
  refreshCache(slug: string): Promise<void>;
  delete(id: string): Promise<void>;
  archive(id: string): Promise<void>;
  unarchive(id: string): Promise<void>;
  getOptions(param?: { label: string; value: string }): Promise<Option[]>;
}
export interface IPostUsecasePublic {
  getBySlug(id: string, isPreview?: boolean): Promise<IPostBySlug>;
}
