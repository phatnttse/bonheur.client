import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account } from '../models/account.model';
import { SupplierCategory } from '../models/category.model';
import { SubscriptionPackage } from '../models/subscription-packages.model';
import { RequestPricing } from '../models/request-pricing.model';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public accountDataSource = new BehaviorSubject<Account | null>(null);
  accountData$ = this.accountDataSource.asObservable();

  public roleDataSource = new BehaviorSubject<Role[] | null>(null);
  roleData$ = this.roleDataSource.asObservable();

  public supplierCategoryDataSource = new BehaviorSubject<
    SupplierCategory[] | null
  >(null);
  supplierCategoryData$ = this.supplierCategoryDataSource.asObservable();

  //Behavior subject: Subscription Packages
  public subscriptionPackagesDataSource = new BehaviorSubject<
    SubscriptionPackage[] | null
  >(null);
  subscriptionPackagesData$ =
    this.subscriptionPackagesDataSource.asObservable();

  public requestPricingDataSource = new BehaviorSubject<
    RequestPricing[] | null
  >(null);
  requestPricingData$ = this.requestPricingDataSource.asObservable();

  resetData() {
    this.accountDataSource.next(null);
  }
}
