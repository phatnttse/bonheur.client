import { inject, Injectable } from "@angular/core";
import { EndpointBase } from "./endpoint-base.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, catchError, Observable } from "rxjs";
import { ListRequestPricingResponse, RequestPricing } from "../models/request-pricing.model";
import { environment } from "../environments/environment.dev";


@Injectable({
    providedIn: 'root',
  })
export class RequestPricingService extends EndpointBase {
    private http = inject(HttpClient);
    public supplierCategoryDataSource = new BehaviorSubject<RequestPricing[] | null>(null);
    supplierCategoryData$ = this.supplierCategoryDataSource.asObservable();

    getAllRequestPricingByAdmin(): Observable<ListRequestPricingResponse>{
        return this.http.get<ListRequestPricingResponse>(`${environment.apiUrl}/api/v1/request-pricing/admin`,
            this.requestHeaders
        ).pipe(
            catchError((error: HttpErrorResponse) => {
              return this.handleError(error, () => this.getAllRequestPricingByAdmin());
            })
          );
    }

}
