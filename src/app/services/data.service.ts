import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account } from '../models/account.model';
import { SupplierCategory } from '../models/category.model';
import { SubscriptionPackage } from '../models/subscription-packages.model';
import { RequestPricing } from '../models/request-pricing.model';
import { Role } from '../models/role.model';
import {
  Supplier,
  SupplierFAQ,
  SupplierSocialNetwork,
} from '../models/supplier.model';
import { FavoriteSupplier } from '../models/favorite-supplier.model';
import { SocialNetwork } from '../models/social-network';
import { Review } from '../models/review.model';
import {
  DashboardData,
  MonthlyDashboardData,
  TopSuppliersByRevenue,
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  //Behavior subject: Account
  public accountDataSource = new BehaviorSubject<Account | null>(null);
  accountData$ = this.accountDataSource.asObservable();

  //Behavior subject: Role
  public roleDataSource = new BehaviorSubject<Role[] | null>(null);
  roleData$ = this.roleDataSource.asObservable();

  //Behavior subject: Supplier Category
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

  //Behavior subject: Supplier
  public supplierDataSource = new BehaviorSubject<Supplier | null>(null);
  supplierData$ = this.supplierDataSource.asObservable();

  //Behavior subject: Province
  public provinceDataSource = new BehaviorSubject<any | null>(null);
  provinceData$ = this.provinceDataSource.asObservable();

  //Behavior subject: Supplier List
  public supplierListDataSource = new BehaviorSubject<Supplier[] | null>(null);
  supplierListData$ = this.supplierListDataSource.asObservable();

  //Behavior subject: Social Network
  public socialNetworkDataSource = new BehaviorSubject<SocialNetwork[] | null>(
    null
  );
  socialNetworkData$ = this.socialNetworkDataSource.asObservable();

  //Behavior subject: Supplier Social Network
  public supplierSocialNetworkDataSource = new BehaviorSubject<
    SupplierSocialNetwork[] | null
  >(null);
  supplierSocialNetworkData$ =
    this.supplierSocialNetworkDataSource.asObservable();

  //Behavior subject: Supplier FAQ
  public faqDataSource = new BehaviorSubject<SupplierFAQ[] | null>(null);
  faqData$ = this.faqDataSource.asObservable();

  //Behavior subject: Reviews
  public reviewDataSource = new BehaviorSubject<Review[] | null>(null);
  reviewData$ = this.reviewDataSource.asObservable();

  //Behavior subject: Search
  public searchDataSource = new BehaviorSubject<string | null>(null);
  searchData$ = this.searchDataSource.asObservable();

  //Behavior subject: Province
  public provinceSearchDataSource = new BehaviorSubject<string | null>(null);
  provinceSearch$ = this.provinceSearchDataSource.asObservable();

  //Behavior subject: Message Unread Count Of User
  public messageUnreadCountUserDataSource = new BehaviorSubject<number | null>(
    null
  );
  messageUnreadCountUserData$ =
    this.messageUnreadCountUserDataSource.asObservable();

  //Behavior subject: Request Pricing
  public requestPricingBySupplierDataSource = new BehaviorSubject<
    RequestPricing[] | null
  >(null);
  requestPricingBySupplierData$ =
    this.requestPricingBySupplierDataSource.asObservable();

  //Behavior subject: Top Suppliers By Revenue
  public topSuppliersByRevenueDataSource = new BehaviorSubject<
    TopSuppliersByRevenue[] | null
  >(null);
  topSuppliersByRevenueData$ =
    this.topSuppliersByRevenueDataSource.asObservable();

  //Behavior subject: Dashboard Data
  public dashboardDataDataSource = new BehaviorSubject<DashboardData | null>(
    null
  );
  dashboardDataData$ = this.dashboardDataDataSource.asObservable();

  //Behavior subject: Monthly Dashboard Data
  public monthlyDashboardDataDataSource = new BehaviorSubject<
    MonthlyDashboardData[] | null
  >(null);
  monthlyDashboardDataData$ =
    this.monthlyDashboardDataDataSource.asObservable();

  resetData() {
    this.accountDataSource.next(null);
    this.supplierDataSource.next(null);
    this.messageUnreadCountUserDataSource.next(0);
    this.requestPricingBySupplierDataSource.next(null);
  }
}
