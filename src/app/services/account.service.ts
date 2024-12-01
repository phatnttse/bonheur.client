import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  public accountDataSource = new BehaviorSubject<Account | null>(null);
  accountData$ = this.accountDataSource.asObservable();

  constructor() {}
}
