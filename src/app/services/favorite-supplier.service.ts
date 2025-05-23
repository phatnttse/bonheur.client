import { BaseResponse } from './../models/base.model';
import { inject, Injectable } from '@angular/core';
import { EndpointBase } from './endpoint-base.service';
import { catchError, Observable } from 'rxjs';
import {
  BaseFavoriteCount,
  FavoriteSupplier,
  PaginatedFavoriteSupplier,
} from '../models/favorite-supplier.model';
import { environment } from '../environments/environment.dev';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FavoriteSupplierService extends EndpointBase {
  private http = inject(HttpClient);

  getAllFavoriteSupplier(
    userId: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedFavoriteSupplier> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    const headers = this.requestHeaders;
    return this.http
      .get<PaginatedFavoriteSupplier>(
        `${environment.apiUrl}/api/v1/favorite-supplier`,
        {
          headers: headers.headers,
          params: params,
        }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.getAllFavoriteSupplier(userId, pageNumber, pageSize)
          );
        })
      );
  }

  getFavoriteSupplierByCategory(
    id: number,
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedFavoriteSupplier> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    const headers = this.requestHeaders;
    return this.http
      .get<PaginatedFavoriteSupplier>(
        `${environment.apiUrl}/api/v1/favorite-supplier/category/${id}`,
        {
          headers: headers.headers,
          params: params,
        }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.getFavoriteSupplierByCategory(id, pageNumber, pageSize)
          );
        })
      );
  }

  addFavoriteSupplier(
    supplierId: number
  ): Observable<BaseResponse<FavoriteSupplier>> {
    return this.http
      .post<BaseResponse<FavoriteSupplier>>(
        `${environment.apiUrl}/api/v1/favorite-supplier`,
        supplierId,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.addFavoriteSupplier(supplierId)
          );
        })
      );
  }

  deleteFavoriteSupplier(
    supplierId: number
  ): Observable<BaseResponse<FavoriteSupplier>> {
    return this.http
      .delete<BaseResponse<FavoriteSupplier>>(
        `${environment.apiUrl}/api/v1/favorite-supplier/${supplierId}`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.deleteFavoriteSupplier(supplierId)
          );
        })
      );
  }

  favoriteCount(): Observable<BaseFavoriteCount> {
    return this.http
      .get<BaseFavoriteCount>(
        `${environment.apiUrl}/api/v1/favorite-supplier/favorite-count`
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.favoriteCount());
        })
      );
  }
}
