import { inject, Injectable } from '@angular/core';
import { EndpointBase } from './endpoint-base.service';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { BaseResponse } from '../models/base.model';
import { environment } from '../environments/environment.dev';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CreatePaymentResult,
  CreateSpPaymentLinkRequest,
  PaymentLinkInformation,
} from '../models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService extends EndpointBase {
  private http = inject(HttpClient);

  payForSubscription(
    request: CreateSpPaymentLinkRequest
  ): Observable<BaseResponse<CreatePaymentResult>> {
    return this.http
      .post<BaseResponse<CreatePaymentResult>>(
        `${environment.apiUrl}/api/v1/payment/subscription-package`,
        request,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.payForSubscription(request)
          );
        })
      );
  }

  getPaymentRequestInfo(
    orderCode: number
  ): Observable<BaseResponse<PaymentLinkInformation>> {
    return this.http
      .get<BaseResponse<PaymentLinkInformation>>(
        `${environment.apiUrl}/api/v1/payment/request-info/${orderCode}`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.getPaymentRequestInfo(orderCode)
          );
        })
      );
  }
}
