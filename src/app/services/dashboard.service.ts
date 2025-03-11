import { inject, Injectable } from '@angular/core';
import { EndpointBase } from './endpoint-base.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BaseResponse } from '../models/base.model';
import {
  DashboardData,
  MonthlyDashboardData,
  TopSuppliersByRevenue,
} from '../models/dashboard.model';
import { catchError, Observable } from 'rxjs';
import { environment } from '../environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends EndpointBase {
  private http = inject(HttpClient);

  getDashboardData(): Observable<BaseResponse<DashboardData>> {
    return this.http
      .get<BaseResponse<DashboardData>>(
        `${environment.apiUrl}/api/v1/dashboard`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.getDashboardData());
        })
      );
  }

  getDashboardDataByMonth(): Observable<BaseResponse<MonthlyDashboardData[]>> {
    return this.http
      .get<BaseResponse<MonthlyDashboardData[]>>(
        `${environment.apiUrl}/api/v1/dashboard/monthly`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.getDashboardDataByMonth());
        })
      );
  }

  getTopSuppliers(): Observable<BaseResponse<TopSuppliersByRevenue[]>> {
    return this.http
      .get<BaseResponse<TopSuppliersByRevenue[]>>(
        `${environment.apiUrl}/api/v1/dashboard/top-suppliers?limit=5`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.getTopSuppliers());
        })
      );
  }
}
