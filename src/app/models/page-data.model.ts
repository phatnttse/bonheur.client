export interface PagedData<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalItemCount: number;
    pageCount: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
  