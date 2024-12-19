import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { Account, AccountResponse, BlockAccountResponse, ListAccountResponse } from '../models/account.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment.dev';
import { EndpointBase } from './endpoint-base.service';
import { RoleResponse } from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService extends EndpointBase {
  public accountDataSource = new BehaviorSubject<Account[] | null>(null);
  accountData$ = this.accountDataSource.asObservable();
  private http = inject(HttpClient);

  getRoles(): Observable<RoleResponse> {
    return this.http
      .get<RoleResponse>(
        `${environment.apiUrl}/api/v1/account/roles`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.getRoles());
        })
      );
  }

  getAccounts(pageNumber: number, pageSize: number): Observable<ListAccountResponse>{
    return this.http
    .get<ListAccountResponse>(
      `${environment.apiUrl}/api/v1/account/users/${pageNumber}/${pageSize}`,
      this.requestHeaders
    )
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error, () => this.getAccounts(pageNumber, pageSize));
      })
    );
  }

  getAccount(id: string) :Observable<AccountResponse>{
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

  blockAccount(id: string, lockoutEnd: Date, isEnable: boolean): Observable<BlockAccountResponse>{
    return this.http
    .patch<BlockAccountResponse>(
      `${environment.apiUrl}/api/v1/account/users/${id}/status`,
      {lockoutEnd, isEnable},
      this.requestHeaders
    )
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error, () => this.blockAccount(id, lockoutEnd, isEnable));
      })
    );
  }
}
