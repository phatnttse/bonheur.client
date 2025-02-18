import { inject, Injectable } from '@angular/core';
import { EndpointBase } from './endpoint-base.service';
import { Order } from '../models/order.model';
import { BaseResponse } from '../models/base.model';
import { catchError, Observable } from 'rxjs';
import { environment } from '../environments/environment.dev';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends EndpointBase {
  private http = inject(HttpClient);

  getOrderByCode(orderCode: number): Observable<BaseResponse<Order>> {
    return this.http
      .get<BaseResponse<Order>>(
        `${environment.apiUrl}/api/v1/orders/code/${orderCode}`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.getOrderByCode(orderCode));
        })
      );
  }
}
