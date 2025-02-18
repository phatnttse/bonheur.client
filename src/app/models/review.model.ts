import { AverageScores, BaseResponse, PaginationResponse } from './base.model';
import { Account } from './account.model';

export interface Review {
  userId: string;
  supplierId: number;
  summaryExperience: string;
  content: string;
  qualityOfService: number;
  responseTime: number;
  professionalism: number;
  valueForMoney: number;
  flexibility: number;
  user: Account;
}

export interface ReviewResponse {
  reviews: PaginationResponse<Review>;
  averageScores: AverageScores;
}

export interface ListReviewResponse extends BaseResponse<ReviewResponse> {}
