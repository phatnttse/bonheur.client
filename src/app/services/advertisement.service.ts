import { inject, Injectable } from '@angular/core';
import { EndpointBase } from './endpoint-base.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Advertisement } from '../models/advertisement.model';
import { BaseResponse, PaginationResponse } from '../models/base.model';
import { catchError, Observable } from 'rxjs';
import { environment } from '../environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class AdvertisementService extends EndpointBase {
  private http = inject(HttpClient);

  getAdvertisements(
    pageNumber: number,
    pageSize: number,
    searchTitle?: string,
    searchContent?: string
  ): Observable<PaginationResponse<Advertisement>> {
    let params = new HttpParams();
    if (searchTitle) {
      params = params.append('searchTitle', searchTitle);
    }

    if (searchContent) {
      params = params.append('searchContent', searchContent);
    }

    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());

    return this.http
      .get<PaginationResponse<Advertisement>>(
        `${environment.apiUrl}/api/v1/advertisements`,
        { headers: this.requestHeaders.headers }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.getAdvertisements(
              pageNumber,
              pageSize,
              searchTitle,
              searchContent
            )
          );
        })
      );
  }

  getAdvertisementsBySupplier(
    pageNumber: number,
    pageSize: number
  ): Observable<PaginationResponse<Advertisement>> {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());

    return this.http
      .get<PaginationResponse<Advertisement>>(
        `${environment.apiUrl}/api/v1/advertisements/supplier`,
        { headers: this.requestHeaders.headers }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.getAdvertisementsBySupplier(pageNumber, pageSize)
          );
        })
      );
  }

  createAdvertisement(
    formData: FormData
  ): Observable<BaseResponse<Advertisement>> {
    return this.http
      .post<BaseResponse<Advertisement>>(
        `${environment.apiUrl}/api/v1/advertisements`,
        formData,
        { headers: this.requestHeaders.headers }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.createAdvertisement(formData)
          );
        })
      );
  }

  updateAdvertisement(
    formData: FormData
  ): Observable<BaseResponse<Advertisement>> {
    return this.http
      .put<BaseResponse<Advertisement>>(
        `${environment.apiUrl}/api/v1/advertisements`,
        formData,
        { headers: this.requestHeaders.headers }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.updateAdvertisement(formData)
          );
        })
      );
  }

  deleteAdvertisement(id: string): Observable<BaseResponse<Advertisement>> {
    return this.http
      .delete<BaseResponse<Advertisement>>(
        `${environment.apiUrl}/api/v1/advertisements/${id}`,
        { headers: this.requestHeaders.headers }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.deleteAdvertisement(id));
        })
      );
  }
}
