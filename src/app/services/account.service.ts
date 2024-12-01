import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account, SignUpResponse } from '../models/account.model';
import { Gender } from '../models/enums.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  public accountDataSource = new BehaviorSubject<Account | null>(null);
  accountData$ = this.accountDataSource.asObservable();
}
