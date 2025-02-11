import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseResponse } from '../models/base.model';
import { SocialNetwork } from '../models/social-network';
import { catchError, Observable } from 'rxjs';
import { environment } from '../environments/environment.dev';
import { EndpointBase } from './endpoint-base.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SocialNetworkService extends EndpointBase {
  private http = inject(HttpClient);

  getSocialNetworks(): Observable<BaseResponse<SocialNetwork[]>> {
    return this.http
      .get<BaseResponse<SocialNetwork[]>>(
        `${environment.apiUrl}/api/v1/social-networks`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.getSocialNetworks());
        })
      );
  }

  getSocialNetworkById(id: string): Observable<BaseResponse<SocialNetwork>> {
    return this.http
      .get<BaseResponse<SocialNetwork>>(
        `${environment.apiUrl}/api/v1/social-networks/${id}`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.getSocialNetworkById(id));
        })
      );
  }

  createSocialNetwork(
    formData: FormData
  ): Observable<BaseResponse<SocialNetwork>> {
    return this.http
      .post<BaseResponse<SocialNetwork>>(
        `${environment.apiUrl}/api/v1/social-networks`,
        formData,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.createSocialNetwork(formData)
          );
        })
      );
  }

  updateSocialNetwork(
    id: number,
    formData: FormData
  ): Observable<BaseResponse<SocialNetwork>> {
    return this.http
      .put<BaseResponse<SocialNetwork>>(
        `${environment.apiUrl}/api/v1/social-networks/${id}`,
        formData,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.updateSocialNetwork(id, formData)
          );
        })
      );
  }

  deleteSocialNetwork(id: number): Observable<BaseResponse<SocialNetwork>> {
    return this.http
      .delete<BaseResponse<SocialNetwork>>(
        `${environment.apiUrl}/api/v1/social-networks/${id}`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.deleteSocialNetwork(id));
        })
      );
  }
}
