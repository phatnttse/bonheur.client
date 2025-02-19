import { inject, Injectable } from '@angular/core';
import { EndpointBase } from './endpoint-base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { ListReviewResponse } from '../models/review.model';
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
}
