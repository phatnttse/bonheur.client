import { IdToken, SignInResponse } from './../models/signin-response.model';
import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';
import { DBkeys } from './db-keys';
import { Utilities } from './utilities';
import { PermissionValues } from '../models/permission.model';
import { OidcHelperService } from './oidc.service';
import { LocalStoreManager } from './localstorage-manager.service';
import { JwtHelper } from './jwt.service';
import { Account } from '../models/account.model';
import { Gender, Role } from '../models/enums.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private oidcHelperService = inject(OidcHelperService);
  private configurations = inject(ConfigurationService);
  private localStorage = inject(LocalStoreManager);
  private notificationService = inject(NotificationService);

  public get homeUrl() {
    return this.configurations.homeUrl;
  }
  public readonly loginUrl = '/authentication/signin';
  public loginRedirectUrl: string | null = null;
  public logoutRedirectUrl: string | null = null;

  public reLoginDelegate: (() => void) | undefined;

  private previousIsLoggedInCheck = false;
  private loginStatus = new Subject<boolean>();

  gotoPage(page: string, preserveParams = true) {
    const navigationExtras: NavigationExtras = {
      queryParamsHandling: preserveParams ? 'merge' : '',
      preserveFragment: preserveParams,
    };

    this.router.navigate([page], navigationExtras);
  }

  gotoHomePage() {
    this.router.navigate([this.homeUrl]);
  }

  redirectLoginUser() {
    const redirect =
      this.loginRedirectUrl &&
      this.loginRedirectUrl !== '/' &&
      this.loginRedirectUrl !== ConfigurationService.defaultHomeUrl
        ? this.loginRedirectUrl
        : this.homeUrl;
    this.loginRedirectUrl = null;

    const urlParamsAndFragment = Utilities.splitInTwo(redirect, '#');
    const urlAndParams = Utilities.splitInTwo(
      urlParamsAndFragment.firstPart,
      '?'
    );

    const navigationExtras: NavigationExtras = {
      fragment: urlParamsAndFragment.secondPart,
      queryParams: urlAndParams.secondPart
        ? Utilities.getQueryParamsFromString(urlAndParams.secondPart)
        : null,
      queryParamsHandling: 'merge',
    };

    this.router.navigate([urlAndParams.firstPart], navigationExtras);
  }

  redirectLogoutUser() {
    const redirect = this.logoutRedirectUrl
      ? this.logoutRedirectUrl
      : this.loginUrl;
    this.logoutRedirectUrl = null;

    this.router.navigate([redirect]);
  }

  redirectForLogin() {
    this.loginRedirectUrl = this.router.url;
    this.router.navigate([this.loginUrl]);
    this.notificationService.showToastrInfo('Please login to access this page');
  }

  reLogin() {
    if (this.reLoginDelegate) {
      this.reLoginDelegate();
    } else {
      this.redirectForLogin();
    }
  }

  refreshLogin() {
    return this.oidcHelperService
      .refreshLogin()
      .pipe(map((resp) => this.processLoginResponse(resp)));
  }

  loginWithPassword(userName: string, password: string) {
    if (this.isLoggedIn) {
      this.logout();
    }

    return this.oidcHelperService
      .loginWithPassword(userName, password)
      .pipe(map((resp) => this.processLoginResponse(resp)));
  }

  loginWithGoogle(idToken: string) {
    if (this.isLoggedIn) {
      this.logout();
    }

    return this.oidcHelperService
      .loginWithGoogle(idToken)
      .pipe(map((resp) => this.processLoginResponse(resp)));
  }

  private processLoginResponse(response: SignInResponse) {
    const idToken = response.id_token;
    const accessToken = response.access_token;
    const refreshToken = response.refresh_token;

    if (idToken == null) {
      throw new Error('idToken cannot be null');
    }

    if (accessToken == null) {
      throw new Error('accessToken cannot be null');
    }

    const accessTokenExpiry = new Date();
    accessTokenExpiry.setSeconds(
      accessTokenExpiry.getSeconds() + response.expires_in
    );

    const jwtHelper = new JwtHelper();
    const decodedIdToken = jwtHelper.decodeToken(idToken) as IdToken;

    const permissions: PermissionValues[] = Array.isArray(
      decodedIdToken.permission
    )
      ? decodedIdToken.permission
      : [decodedIdToken.permission];

    const user = new Account(
      decodedIdToken.sub,
      decodedIdToken.name,
      decodedIdToken.fullname,
      decodedIdToken.email,
      decodedIdToken.emailConfirmed,
      decodedIdToken.gender,
      decodedIdToken.pictureUrl,
      Array.isArray(decodedIdToken.role)
        ? decodedIdToken.role
        : [decodedIdToken.role]
    );

    user.isEnabled = true;

    this.saveUserDetails(
      user,
      permissions,
      accessToken,
      refreshToken,
      accessTokenExpiry
    );

    this.reevaluateLoginStatus(user);

    return user;
  }

  private saveUserDetails(
    user: Account,
    permissions: PermissionValues[],
    accessToken: string,
    refreshToken: string,
    expiresIn: Date
  ) {
    this.localStorage.setData(accessToken, DBkeys.ACCESS_TOKEN);
    this.localStorage.setData(refreshToken, DBkeys.REFRESH_TOKEN);
    this.localStorage.setData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
    this.localStorage.setData(permissions, DBkeys.USER_PERMISSIONS);
    this.localStorage.setData(user, DBkeys.CURRENT_USER);
  }

  signUpAccount(
    fullName: string,
    email: string,
    gender: Gender,
    password: string
  ) {
    return this.oidcHelperService.signUpAccount(
      fullName,
      email,
      gender,
      password
    );
  }

  confirmEmail(token: string, email: string) {
    return this.oidcHelperService.confirmEmail(token, email);
  }

  forgotPassword(email: string) {
    return this.oidcHelperService.forgotPassword(email);
  }

  resetPassword(token: string, email: string, password: string) {
    return this.oidcHelperService.resetPassword(token, email, password);
  }

  logout(): void {
    this.localStorage.deleteData(DBkeys.ACCESS_TOKEN);
    this.localStorage.deleteData(DBkeys.REFRESH_TOKEN);
    this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);
    this.localStorage.deleteData(DBkeys.USER_PERMISSIONS);
    this.localStorage.deleteData(DBkeys.CURRENT_USER);

    this.configurations.clearLocalChanges();

    this.reevaluateLoginStatus();
  }

  private reevaluateLoginStatus(currentUser?: Account | null) {
    const user =
      currentUser ??
      this.localStorage.getDataObject<Account>(DBkeys.CURRENT_USER);
    const isLoggedIn = user != null;

    if (this.previousIsLoggedInCheck !== isLoggedIn) {
      setTimeout(() => {
        this.loginStatus.next(isLoggedIn);
      });
    }

    this.previousIsLoggedInCheck = isLoggedIn;
  }

  getLoginStatusEvent(): Observable<boolean> {
    return this.loginStatus.asObservable();
  }

  get currentUser(): Account | null {
    const user = this.localStorage.getDataObject<Account>(DBkeys.CURRENT_USER);
    this.reevaluateLoginStatus(user);

    return user;
  }

  get userPermissions(): PermissionValues[] {
    return (
      this.localStorage.getDataObject<PermissionValues[]>(
        DBkeys.USER_PERMISSIONS
      ) ?? []
    );
  }

  get accessToken(): string | null {
    return this.oidcHelperService.accessToken;
  }

  get accessTokenExpiryDate(): Date | null {
    return this.oidcHelperService.accessTokenExpiryDate;
  }

  get refreshToken(): string | null {
    return this.oidcHelperService.refreshToken;
  }

  get isSessionExpired(): boolean {
    return this.oidcHelperService.isSessionExpired;
  }

  get isLoggedIn(): boolean {
    return this.currentUser != null;
  }

  get isAdmin(): boolean {
    return (
      this.isLoggedIn && this.currentUser?.roles.includes(Role.ADMIN) === true
    );
  }

  get isSupplier(): boolean {
    return (
      this.isLoggedIn &&
      this.currentUser?.roles.includes(Role.SUPPLIER) === true
    );
  }
}
