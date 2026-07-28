export type BonusReponseGetAll = AdvancedSearchResponse<
  Pick<IBonus, "text" | "updatedAt">
>;

export interface IBonusRepository {
  getAllPaginated(param: {
    query: AdvancedSearchQuery;
    entityId: string;
  }): BonusReponseGetAll;
  getAllActiveByEntityId(entityId: string): Promise<IBonus[]>;
  getById(id: string): Promise<IBonus>;
  create(input: InputBonus): Promise<IBonus>;
  update(id: string, input: InputBonus): Promise<IBonus>;
  delete(id: string): Promise<IBonus>;
}

export interface IBonusUsecase {
  getAllActivePaginated(
    query: AdvancedSearchQuery,
    entityId: string,
  ): BonusReponseGetAll;
  getAllActiveByEntityId(entityId: string): Promise<IBonus[]>;
  create(data: InputBonus): Promise<IBonus>;
  getById(id: string): Promise<IBonus>;

  create(input: InputBonus): Promise<IBonus>;
  update(id: string, data: InputBonus): Promise<IBonus>;
  delete(id: string): Promise<boolean>;
}
