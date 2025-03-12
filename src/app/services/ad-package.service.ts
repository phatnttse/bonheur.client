import { inject, Injectable } from '@angular/core';
import { EndpointBase } from './endpoint-base.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { BaseResponse, PaginationResponse } from '../models/base.model';
import { AdPackage, AdPackageRequest } from '../models/ad-package.model';
import { environment } from '../environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class AdPackageService extends EndpointBase {
  private http = inject(HttpClient);

  getAdPackages(
    pageNumber: number,
    pageSize: number,
    adPackageTitle?: string
  ): Observable<PaginationResponse<AdPackage>> {
    let params = new HttpParams();
    if (adPackageTitle) {
      params = params.append('title', adPackageTitle);
    }
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());

    return this.http
      .get<PaginationResponse<AdPackage>>(
        `${environment.apiUrl}/api/v1/ad-package`,
        { headers: this.requestHeaders.headers }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.getAdPackages(pageNumber, pageSize, adPackageTitle)
          );
        })
      );
  }

  getAdPackageById(id: number): Observable<BaseResponse<AdPackage>> {
    return this.http
      .get<BaseResponse<AdPackage>>(
        `${environment.apiUrl}/api/v1/ad-package/${id}`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.getAdPackageById(id));
        })
      );
  }

  createAdPackage(
    adPackageRequest: AdPackageRequest
  ): Observable<BaseResponse<AdPackage>> {
    return this.http
      .post<BaseResponse<AdPackage>>(
        `${environment.apiUrl}/api/v1/ad-package`,
        adPackageRequest,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.createAdPackage(adPackageRequest)
          );
        })
      );
  }

  updateAdPackage(
    id: number,
    adPackageRequest: AdPackageRequest
  ): Observable<BaseResponse<AdPackage>> {
    return this.http
      .put<BaseResponse<AdPackage>>(
        `${environment.apiUrl}/api/v1/ad-package/${id}`,
        adPackageRequest,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.updateAdPackage(id, adPackageRequest)
          );
        })
      );
  }

  deleteAdPackage(id: number): Observable<BaseResponse<AdPackage>> {
    return this.http
      .delete<BaseResponse<AdPackage>>(
        `${environment.apiUrl}/api/v1/ad-package/${id}`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.deleteAdPackage(id));
        })
      );
  }
}
