import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account } from '../models/account.model';
import { SupplierCategory } from '../models/category.model';
import { SubscriptionPackage } from '../models/subscription-packages.model';
import { RequestPricing } from '../models/request-pricing.model';
import { Role } from '../models/role.model';
import { Supplier } from '../models/supplier.model';
import { FavoriteSupplier } from '../models/favorite-supplier.model';

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

  //Behavior subject: Request Pricing
  public requestPricingDataSource = new BehaviorSubject<
    RequestPricing[] | null
  >(null);
  requestPricingData$ = this.requestPricingDataSource.asObservable();

  //Behavior subject: Favorite Supplier
  public favoriteSupplierDataSource = new BehaviorSubject<
    FavoriteSupplier[] | null
  >(null);
  favoriteSupplierData$ = this.favoriteSupplierDataSource.asObservable();

  public supplierDataSource = new BehaviorSubject<Supplier | null>(null);
  supplierData$ = this.supplierDataSource.asObservable();

  public provinceDataSource = new BehaviorSubject<any | null>(null);
  provinceData$ = this.provinceDataSource.asObservable();

  resetData() {
    this.accountDataSource.next(null);
  }
}
