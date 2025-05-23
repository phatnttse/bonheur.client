import { StatusCode } from './enums.model';
export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: StatusCode;
}

/**
 * Pagination request model
 */
export interface PaginationRequest {
  pageNumber: number;
  pageSize: number;
}

/**
 * Pagination response model
 */
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

export interface PaginationData<T> {
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

export interface AverageScores {
  averageValueOfMoney: number;
  averageFlexibility: number;
  averageProfessionalism: number;
  averageQualityOfService: number;
  averageResponseTime: number;
}
