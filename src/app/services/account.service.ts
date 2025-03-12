import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import {
  AccountResponse,
  BlockAccountResponse,
  ListAccountResponse,
} from '../models/account.model';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { environment } from '../environments/environment.dev';
import { EndpointBase } from './endpoint-base.service';
import { ListRoleResponse, RoleResponse } from '../models/role.model';
import { BaseResponse } from '../models/base.model';
import { Permission } from '../models/permission.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService extends EndpointBase {
  private http = inject(HttpClient);

  getRoles(): Observable<ListRoleResponse> {
    return this.http
      .get<ListRoleResponse>(
        `${environment.apiUrl}/api/v1/account/roles`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.getRoles());
        })
      );
  }

  getRole(id: string): Observable<RoleResponse> {
    return this.http
      .get<RoleResponse>(
        `${environment.apiUrl}/api/v1/account/roles/${id}`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.getRole(id));
        })
      );
  }

  getAllPermissions(): Observable<BaseResponse<Permission[]>> {
    return this.http
      .get<BaseResponse<Permission[]>>(
        `${environment.apiUrl}/api/v1/account/permissions`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.getAllPermissions());
        })
      );
  }

  getAccounts(
    search: string,
    role: string,
    pageNumber: number,
    pageSize: number
  ): Observable<ListAccountResponse> {
    const params = new HttpParams()
      .set('search', search)
      .set('role', role)
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http
      .get<ListAccountResponse>(`${environment.apiUrl}/api/v1/account/users`, {
        params: params,
        headers: this.requestHeaders.headers,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.getAccounts(search, role, pageNumber, pageSize)
          );
        })
      );
  }

  getAccount(id: string): Observable<AccountResponse> {
    return this.http
      .get<AccountResponse>(
        `${environment.apiUrl}/api/v1/account/users/${id}`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.getAccount(id));
        })
      );
  }

  blockAccount(
    id: string,
    lockoutEnd: Date,
    isEnable: boolean
  ): Observable<BlockAccountResponse> {
    return this.http
      .patch<BlockAccountResponse>(
        `${environment.apiUrl}/api/v1/account/users/${id}/status`,
        { lockoutEnd, isEnable },
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.blockAccount(id, lockoutEnd, isEnable)
          );
        })
      );
  }
  getProfile() {
    return this.http
      .get<AccountResponse>(
        `${environment.apiUrl}/api/v1/account/users/me`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.getProfile());
        })
      );
  }

  uploadProfile(formData: FormData): Observable<AccountResponse> {
    return this.http
      .post<AccountResponse>(
        `${environment.apiUrl}/api/v1/account/users/avatar`,
        formData,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.uploadProfile(formData));
        })
      );
  }

  updateEmail(email: string): Observable<BaseResponse<null>> {
    return this.http
      .post<BaseResponse<null>>(
        `${environment.apiUrl}/api/v1/account/users/change-email`,
        { email },
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.updateEmail(email));
        })
      );
  }
}
