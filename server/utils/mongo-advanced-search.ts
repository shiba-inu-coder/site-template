import type { PipelineStage } from "mongoose";

export class MongoAdvancedSearch {
  static getSort(sort: string | undefined): PipelineStage.Sort {
    if (!sort) {
      return {
        $sort: {
          updatedAt: -1,
        },
      };
    }

    const keyValuePairs = sort.split(",").map((pair) => {
      const [key, value] = pair.split(":").map((item) => item.trim());
      return { [key as string]: parseInt(value as string) };
    });

    const result = Object.assign({}, ...keyValuePairs);

    return { $sort: result };
  }

  static getSearch(search = "", searchKeys = "") {
    if (!search || !searchKeys) {
      return undefined;
    }
    const parsedSearchKeys = searchKeys ? searchKeys.split(",") : [];
    const result = parsedSearchKeys.map((key) => ({
      [key]: { $regex: search, $options: "i" },
    }));
    return { $or: result };
  }

  static getPagination<T>({
    page: currentPage,
    limit,
    items,
  }: {
    page: number;
    limit: number;
    items: T[];
  }) {
    const total = items.length;
    const startIndex = (currentPage - 1) * limit;
    const endIndex = Math.min(startIndex + limit, items.length);
    const result = items.slice(startIndex, endIndex);
    const totalPages = Math.ceil(total / limit);
    const nextPage = currentPage < totalPages;

    return {
      nextPage,
      page: currentPage,
      total,
      items: result,
      totalPages,
    };
  }

  static parseQuery<T>(query: {
    page: number;
    limit: number;
    sort: string;
    search: string;
    searchKeys: string;
    filter?: string;
  }): {
    page: number;
    limit: number;
    sort: string | undefined;
    search: string;
    searchKeys: string;
    filter: T;
  } {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;
    const sort = query.sort;
    const search = query.search ? String(query.search) : "";
    const searchKeys = query.searchKeys ? query.searchKeys : "";
    const filter = query.filter ? JSON.parse(query.filter) : undefined;
    return {
      page,
      limit,
      sort,
      search,
      searchKeys,
      filter,
    };
  }
}
