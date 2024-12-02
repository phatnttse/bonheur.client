import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment.dev';
import { SignInResponse } from '../models/signin-response.model';
import { LocalStoreManager } from './localstorage-manager.service';
import { ConfigurationService } from './configuration.service';
import { DBkeys } from './db-keys';
import { Gender } from '../models/enums.model';
import { SignUpResponse } from '../models/account.model';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/base.model';

@Injectable({
  providedIn: 'root',
})
export class OidcHelperService {
  private http = inject(HttpClient);
  private localStorage = inject(LocalStoreManager);

  private readonly clientId = 'bonheur_spa';
  private readonly scope = 'openid email phone profile offline_access roles';

  private get tokenEndpoint() {
    return `${environment.apiUrl}/connect/token`;
  }

  loginWithPassword(userName: string, password: string) {
    const header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const params = new HttpParams()
      .append('username', userName)
      .append('password', password)
      .append('client_id', this.clientId)
      .append('grant_type', 'password')
      .append('scope', this.scope);

    return this.http.post<SignInResponse>(this.tokenEndpoint, params, {
      headers: header,
    });
  }

  refreshLogin() {
    const header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const params = new HttpParams()
      .append('refresh_token', this.refreshToken ?? '')
      .append('client_id', this.clientId)
      .append('grant_type', 'refresh_token');

    return this.http.post<SignInResponse>(this.tokenEndpoint, params, {
      headers: header,
    });
  }

  loginWithGoogle(idToken: string) {
    const header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const params = new HttpParams()
      .append('assertion', idToken)
      .append('client_id', this.clientId)
      .append('grant_type', 'assertion')
      .append('identity_provider', 'google')
      .append('scope', this.scope);

    return this.http.post<SignInResponse>(this.tokenEndpoint, params, {
      headers: header,
    });
  }

  signUpAccount(
    fullName: string,
    email: string,
    gender: Gender,
    password: string
  ): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(
      `${environment.apiUrl}/api/v1/auth/signup`,
      { fullName, email, gender, password }
    );
  }

  confirmEmail(token: string, email: string): Observable<BaseResponse<null>> {
    return this.http.post<BaseResponse<null>>(
      `${environment.apiUrl}/api/v1/auth/confirm-email`,
      {
        token: token,
        email: email,
      }
    );
  }

  forgotPassword(email: string): Observable<BaseResponse<null>> {
    return this.http.post<BaseResponse<null>>(
      `${environment.apiUrl}/api/v1/auth/forgot-password`,
      email
    );
  }

  resetPassword(
    token: string,
    email: string,
    password: string
  ): Observable<BaseResponse<null>> {
    return this.http.post<BaseResponse<null>>(
      `${environment.apiUrl}/api/v1/auth/reset-password`,
      {
        token,
        email,
        password,
      }
    );
  }

  get accessToken(): string | null {
    return this.localStorage.getData(DBkeys.ACCESS_TOKEN);
  }

  get accessTokenExpiryDate(): Date | null {
    return this.localStorage.getDataObject<Date>(DBkeys.TOKEN_EXPIRES_IN, true);
  }

  get refreshToken(): string | null {
    return this.localStorage.getData(DBkeys.REFRESH_TOKEN);
  }

  get isSessionExpired(): boolean {
    if (this.accessTokenExpiryDate == null) {
      return true;
    }

    return this.accessTokenExpiryDate.valueOf() <= new Date().valueOf();
  }
}
