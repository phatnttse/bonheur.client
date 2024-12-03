import { StatusCode } from './enums.model';

/**
 * Base response model
 */
export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T | object | null;
  statusCode: StatusCode;
}

/**
 * Pagination response model
 */
export interface PaginationResponse<T> {
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
