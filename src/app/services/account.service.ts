import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { Account } from '../models/account.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment.dev';
import { EndpointBase } from './endpoint-base.service';
import { RoleResponse } from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService extends EndpointBase {
  private http = inject(HttpClient);
  public accountDataSource = new BehaviorSubject<Account | null>(null);
  accountData$ = this.accountDataSource.asObservable();

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
}
