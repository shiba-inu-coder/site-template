export type IWriterReponseGetAll = AdvancedSearchResponse<IWriter>;

export interface IWriterRepository {
  getAll(query: AdvancedSearchQuery): IWriterReponseGetAll;
  getOptions(param?: { label: string; value: string }): Promise<Option[]>;
  getById(id: string): Promise<IWriter>;
  create(input: InputWriter): Promise<IWriter>;
  update(id: string, input: InputWriter): Promise<IWriter>;
  delete(id: string): Promise<boolean>;
}

export interface IWriterUsecase {
  getAll(query: AdvancedSearchQuery): IWriterReponseGetAll;
  getOptions(param?: { label: string; value: string }): Promise<Option[]>;
  getById(id: string): Promise<IWriter>;
  create(input: InputWriter): Promise<IWriter>;
  update(id: string, input: InputWriter): Promise<IWriter>;
  delete(id: string): Promise<boolean>;
}
