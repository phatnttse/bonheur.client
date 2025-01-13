import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import {
  ListSubscriptionPackageResponse,
  SubscriptionPackage,
  SubscriptionPackageResponse,
} from '../models/subscription-packages.model';
import { EndpointBase } from './endpoint-base.service';
import { environment } from '../environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionPackagesService extends EndpointBase {
  private http = inject(HttpClient);

  getSubscriptionPackages(): Observable<ListSubscriptionPackageResponse> {
    return this.http
      .get<ListSubscriptionPackageResponse>(
        `${environment.apiUrl}/api/v1/subscription-packages`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.getSubscriptionPackages());
        })
      );
  }

  createSubscriptionPackage(
    subscriptionPackage: SubscriptionPackage
  ): Observable<SubscriptionPackageResponse> {
    return this.http
      .post<SubscriptionPackageResponse>(
        `${environment.apiUrl}/api/v1/subscription-packages`,
        { ...subscriptionPackage },
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.createSubscriptionPackage(subscriptionPackage)
          );
        })
      );
  }

  updateSubscriptionPackage(
    id: number,
    subscriptionPackage: SubscriptionPackage
  ): Observable<SubscriptionPackageResponse> {
    return this.http
      .put<SubscriptionPackageResponse>(
        `${environment.apiUrl}/api/v1/subscription-packages/${id}`,
        { id, ...subscriptionPackage },
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.updateSubscriptionPackage(id, subscriptionPackage)
          );
        })
      );
  }

  deleteSubscriptionPackage(
    id: number
  ): Observable<SubscriptionPackageResponse> {
    return this.http
      .delete<SubscriptionPackageResponse>(
        `${environment.apiUrl}/api/v1/subscription-packages/${id}`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.deleteSubscriptionPackage(id)
          );
        })
      );
  }

  getSubscriptionPackageById(
    id: number
  ): Observable<SubscriptionPackageResponse> {
    return this.http
      .get<SubscriptionPackageResponse>(
        `${environment.apiUrl}/api/v1/subscription-packages/${id}`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.getSubscriptionPackageById(id)
          );
        })
      );
  }
}
