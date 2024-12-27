import { inject, Injectable } from '@angular/core';
import { EndpointBase } from './endpoint-base.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../environments/environment.dev';
import { BaseResponse, PaginationResponse } from '../models/base.model';
import { Supplier } from '../models/supplier.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierService extends EndpointBase {
  private http = inject(HttpClient);

  constructor() {
    super();
  }

  getSuppliers(): Observable<PaginationResponse<Supplier>> {
    return this.http
      .get<PaginationResponse<Supplier>>(
        `${environment.apiUrl}/api/v1/suppliers`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.getSuppliers());
        })
      );
  }
}
