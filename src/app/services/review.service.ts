import { inject, Injectable } from '@angular/core';
import { EndpointBase } from './endpoint-base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import {
  CreateReview,
  ListReviewResponse,
  Review,
  ReviewCreation,
} from '../models/review.model';
import { environment } from '../environments/environment.dev';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReviewService extends EndpointBase {
  private http = inject(HttpClient);

  getReviews(
    supplierId: number,
    pageNumber: number,
    pageSize: number
  ): Observable<ListReviewResponse> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http
      .get<ListReviewResponse>(
        `${environment.apiUrl}/api/v1/review/supplier/${supplierId}`,
        { params: params }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.getReviews(supplierId, pageNumber, pageSize)
          );
        })
      );
  }

  createReview(review: CreateReview): Observable<ReviewCreation> {
    return this.http
      .post<ReviewCreation>(
        `${environment.apiUrl}/api/v1/review`,
        review,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.createReview(review));
        })
      );
  }

  createRequestReview(email: string, content: string): Observable<any> {
    return this.http
      .post<any>(
        `${environment.apiUrl}/api/v1/review/request-review`,
        { email, content },
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.createRequestReview(email, content)
          );
        })
      );
  }

  getAverageRating(supplierId: number): Observable<any> {
    return this.http
      .get<any>(
        `${environment.apiUrl}/api/v1/review/average-rating/${supplierId}`
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.getAverageRating(supplierId)
          );
        })
      );
  }
}
