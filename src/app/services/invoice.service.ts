import { inject, Injectable } from '@angular/core';
import { EndpointBase } from './endpoint-base.service';
import { Invoice } from '../models/invoice.model';
import { BaseResponse } from '../models/base.model';
import { catchError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService extends EndpointBase {
  private http = inject(HttpClient);

  getInvoicesBySupplier(): Observable<BaseResponse<Invoice[]>> {
    return this.http
      .get<BaseResponse<Invoice[]>>(
        `${environment.apiUrl}/api/v1/invoices/supplier`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.getInvoicesBySupplier());
        })
      );
  }

  getInvoicesById(id: number): Observable<BaseResponse<Invoice>> {
    return this.http
      .get<BaseResponse<Invoice>>(
        `${environment.apiUrl}/api/v1/invoices/supplier/${id}`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.getInvoicesById(id));
        })
      );
  }
}
