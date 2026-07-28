export type IPaymentMethodReponseGetAll =
  AdvancedSearchResponse<IPaymentMethod>;

export interface IPaymentMethodRepository {
  getAll(query: AdvancedSearchQuery): IPaymentMethodReponseGetAll;
  getOptions(param?: { label: string; value: string }): Promise<Option[]>;
  getById(id: string): Promise<IPaymentMethod>;
  create(input: InputPaymentMethod): Promise<IPaymentMethod>;
  update(id: string, input: InputPaymentMethod): Promise<IPaymentMethod>;
  delete(id: string): Promise<boolean>;
}

export interface IPaymentMethodUsecase {
  getAll(query: AdvancedSearchQuery): IPaymentMethodReponseGetAll;
  getOptions(param?: { label: string; value: string }): Promise<Option[]>;
  getById(id: string): Promise<IPaymentMethod>;
  create(input: InputPaymentMethod): Promise<IPaymentMethod>;
  update(id: string, input: InputPaymentMethod): Promise<IPaymentMethod>;
  delete(id: string): Promise<boolean>;
}
