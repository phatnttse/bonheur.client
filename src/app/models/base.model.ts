import { StatusCode } from './enums.model';

export interface PaginationResponse<T> {
  success: boolean;
  message: string;
  statusCode: StatusCode;
  data: {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalItemCount: number;
    pageCount: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: StatusCode;
}
