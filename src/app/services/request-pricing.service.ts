import { BaseResponse } from './../models/base.model';
import { inject, Injectable } from "@angular/core";
import { EndpointBase } from "./endpoint-base.service";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { BehaviorSubject, catchError, Observable } from "rxjs";
import { ListRequestPricingResponse, RequestPricing, RequestPricingResponse } from "../models/request-pricing.model";
import { environment } from "../environments/environment.dev";


@Injectable({
    providedIn: 'root',
  })
export class RequestPricingService extends EndpointBase {
    private http = inject(HttpClient);
    public supplierCategoryDataSource = new BehaviorSubject<RequestPricing[] | null>(null);
    supplierCategoryData$ = this.supplierCategoryDataSource.asObservable();

    getAllRequestPricingByAdmin(pageNumber: number, pageSize: number): Observable<ListRequestPricingResponse> {
        const params = new HttpParams()
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());
        const headers = this.requestHeaders;
        return this.http
          .get<ListRequestPricingResponse>(`${environment.apiUrl}/api/v1/request-pricing/admin`, {
             headers: headers.headers, 
             params: params    
          })
          .pipe(
            catchError((error: HttpErrorResponse) => {
              return this.handleError(error, () => this.getAllRequestPricingByAdmin(pageNumber, pageSize));
            })
          );
      } 
      
      getRequestPricingById(id: number): Observable<RequestPricingResponse> {
        const headers = this.requestHeaders;
        return this.http
          .get<RequestPricingResponse>(`${environment.apiUrl}/api/v1/request-pricing/${id}`, this.requestHeaders)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              return this.handleError(error, () => this.getRequestPricingById(id));
            })
          );
      } 
}
