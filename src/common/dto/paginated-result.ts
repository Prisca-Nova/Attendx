export class PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  fromInstance(value: T): PaginatedResult<T> {
    return Object.assign(this, value);
  }
}
export enum SortType {
  asc,
  desc,
}
export abstract class QueryParamOptions {
  page?: number;
  limit: number;
  sort?: SortType;
  order?: string;
  search?: string;
  filter?: { [key: string]: any };
  include?: string[];
  exclude?: string[];
}
