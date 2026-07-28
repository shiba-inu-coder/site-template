export type ISportReponseGetAll = AdvancedSearchResponse<ISport>;

export interface ISportRepository {
  getAll(query: AdvancedSearchQuery): ISportReponseGetAll;
  getOptions(param?: { label: string; value: string }): Promise<Option[]>;
  getById(id: string): Promise<ISport>;
  create(input: InputSport): Promise<ISport>;
  update(id: string, input: InputSport): Promise<ISport>;
  delete(id: string): Promise<boolean>;
}

export interface ISportUsecase {
  getAll(query: AdvancedSearchQuery): ISportReponseGetAll;
  getOptions(param?: { label: string; value: string }): Promise<Option[]>;
  getById(id: string): Promise<ISport>;
  create(input: InputSport): Promise<ISport>;
  update(id: string, input: InputSport): Promise<ISport>;
  delete(id: string): Promise<boolean>;
}
