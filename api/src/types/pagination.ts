export type PaginationResult<T> = {
    data: T[];
    meta?: {
        total: number;
        page: number;
        lastPage: number;
    }
}