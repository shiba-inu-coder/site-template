export type ISoftwareProviderReponseGetAll =
  AdvancedSearchResponse<ISoftwareProvider>;

export interface ISoftwareProviderRepository {
  getAll(query: AdvancedSearchQuery): ISoftwareProviderReponseGetAll;
  getOptions(param?: { label: string; value: string }): Promise<Option[]>;
  getById(id: string): Promise<ISoftwareProvider>;
  create(input: InputSoftwareProvider): Promise<ISoftwareProvider>;
  update(id: string, input: InputSoftwareProvider): Promise<ISoftwareProvider>;
  delete(id: string): Promise<boolean>;
}

export interface ISoftwareProviderUsecase {
  getAll(query: AdvancedSearchQuery): ISoftwareProviderReponseGetAll;
  getOptions(param?: { label: string; value: string }): Promise<Option[]>;
  getById(id: string): Promise<ISoftwareProvider>;
  create(input: InputSoftwareProvider): Promise<ISoftwareProvider>;
  update(id: string, input: InputSoftwareProvider): Promise<ISoftwareProvider>;
  delete(id: string): Promise<boolean>;
}
