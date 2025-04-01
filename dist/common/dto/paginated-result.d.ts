export declare class PaginatedResult<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    fromInstance(value: T): PaginatedResult<T>;
}
export declare enum SortType {
    asc = 0,
    desc = 1
}
export declare abstract class QueryParamOptions {
    page?: number;
    limit: number;
    sort?: SortType;
    order?: string;
    search?: string;
    filter?: {
        [key: string]: any;
    };
    include?: string[];
    exclude?: string[];
}
