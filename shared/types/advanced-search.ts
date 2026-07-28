export interface DraftItem {
  data: any;
  date: Date;
  formId: string;
  status: string;
  mode: FormMode;
}

export enum ApiService {
  posts = "posts",
  writers = "writers",
  casinos = "casinos",
  "game-types" = "game-types",
  "software-providers" = "software-providers",
  "payment-methods" = "payment-methods",
  "bookmakers" = "bookmakers",
  "bonuses" = "bonuses",
  "sports" = "sports",
}

export enum CrudArhiveListServices {
  posts = "posts",
  casinos = "casinos",
  bookmakers = "bookmakers",
}

export type DraftKeyList = "post" | "casino" | "bookmaker";

export interface TableSortParam {
  [key: string]: 1 | -1;
}

export interface TableFieldParam {
  key: string;
  label: string;
  thPosition?: "center" | "left" | "right";
  sortable: boolean;
  search: boolean;
}

export interface ListProps {
  fields?: TableFieldParam[];
  disallowCreate?: boolean;
  disallowEdit?: boolean;
  disallowDelete?: boolean;
  defaultSort?: TableSortParam;
  pathCreate?: string;
  pathEdit?: string;
}

export interface AdvanceTableProps extends ListProps {
  title: string;
  api: keyof typeof ApiService;
  draftKey?: DraftKeyList;
  pathCreate: string;
  pathEdit: string;
  routeMainParamKey?: string;
  routeAdditionalParams?: { [key: string]: string };
}

export interface DataTableProps extends ListProps {
  api: keyof typeof ApiService;
}
export interface DataTableArhiveProps extends Pick<ListProps, "fields"> {
  api: keyof typeof ApiService;
}

export interface AdvancedSearchQuery {
  page: number;
  limit: number;
  sort: string;
  search: string;
  searchKeys: string;
  filter?: string;
}
export type AdvancedSearchResponse<T> = Promise<{
  nextPage: boolean;
  page: number;
  total: number;
  items: T[];
  totalPages: number;
}>;
