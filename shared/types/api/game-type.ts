export type IGameTypeReponseGetAll = AdvancedSearchResponse<IGameType>;

export interface IGameTypeRepository {
  getAll(query: AdvancedSearchQuery): IGameTypeReponseGetAll;
  getOptions(param?: { label: string; value: string }): Promise<Option[]>;
  getById(id: string): Promise<IGameType>;
  create(input: InputGameType): Promise<IGameType>;
  update(id: string, input: InputGameType): Promise<IGameType>;
  delete(id: string): Promise<boolean>;
}

export interface IGameTypeUsecase {
  getAll(query: AdvancedSearchQuery): IGameTypeReponseGetAll;
  getOptions(param?: { label: string; value: string }): Promise<Option[]>;
  getById(id: string): Promise<IGameType>;
  create(input: InputGameType): Promise<IGameType>;
  update(id: string, input: InputGameType): Promise<IGameType>;
  delete(id: string): Promise<boolean>;
}
