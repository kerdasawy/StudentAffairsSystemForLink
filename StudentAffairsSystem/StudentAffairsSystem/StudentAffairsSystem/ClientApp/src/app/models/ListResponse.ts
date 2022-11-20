
export interface ListResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}
