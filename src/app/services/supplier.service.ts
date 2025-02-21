import { inject, Injectable } from '@angular/core';
import { EndpointBase } from './endpoint-base.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../environments/environment.dev';
import { BaseResponse, PaginationResponse } from '../models/base.model';
import {
  GetSuppliersParams,
  RegisterSupplierRequest,
  Supplier,
  SupplierFAQ,
  SupplierFAQRequest,
  SupplierImage,
  SupplierSocialNetwork,
  SupplierSocialNetworkRequest,
  UpdateSupplierAddressRequest,
  UpdateSupplierProfileRequest,
} from '../models/supplier.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierService extends EndpointBase {
  private http = inject(HttpClient);

  constructor() {
    super();
  }

  getSuppliers(
    getSuppliersParams: GetSuppliersParams
  ): Observable<PaginationResponse<Supplier>> {
    let params = new HttpParams();

    // Only set params if they are valid (not empty or greater than zero)
    if (getSuppliersParams.supplierName) {
      params = params.set('supplierName', getSuppliersParams.supplierName);
    }

    if (getSuppliersParams.supplierCategoryIds?.length) {
      getSuppliersParams.supplierCategoryIds.forEach((id) => {
        params = params.append('supplierCategoryIds', id);
      });
    }

    if (getSuppliersParams.province) {
      params = params.set('province', getSuppliersParams.province);
    }

    if (getSuppliersParams.isFeatured) {
      params = params.set(
        'isFeatured',
        getSuppliersParams.isFeatured?.toString()
      );
    }

    if (getSuppliersParams.averageRating) {
      params = params.set(
        'averageRating',
        getSuppliersParams.averageRating?.toString()
      );
    }

    if (getSuppliersParams.minPrice && getSuppliersParams.minPrice > 0) {
      params = params.set('minPrice', getSuppliersParams.minPrice?.toString());
    }

    if (getSuppliersParams.maxPrice && getSuppliersParams.maxPrice > 0) {
      params = params.set('maxPrice', getSuppliersParams.maxPrice?.toString());
    }

    if (getSuppliersParams.sortAsc) {
      params = params.set('sortAsc', getSuppliersParams.sortAsc?.toString());
    }

    params = params.set(
      'pageNumber',
      getSuppliersParams.pageNumber?.toString() || '1'
    );
    params = params.set(
      'pageSize',
      getSuppliersParams.pageSize?.toString() || '10'
    );

    return this.http
      .get<PaginationResponse<Supplier>>(
        `${environment.apiUrl}/api/v1/suppliers`,
        { params, headers: this.requestHeaders.headers }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.getSuppliers(getSuppliersParams)
          );
        })
      );
  }

  getSupplierBySlug(slug: string): Observable<BaseResponse<Supplier>> {
    return this.http
      .get<BaseResponse<Supplier>>(
        `${environment.apiUrl}/api/v1/suppliers/slug/${slug}`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.getSupplierBySlug(slug));
        })
      );
  }

  getSupplierByUserId(userId: string): Observable<BaseResponse<Supplier>> {
    return this.http
      .get<BaseResponse<Supplier>>(
        `${environment.apiUrl}/api/v1/suppliers/users/${userId}`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.getSupplierByUserId(userId)
          );
        })
      );
  }

  registerToBecomeSupplier(
    registerSupplierRequest: RegisterSupplierRequest
  ): Observable<BaseResponse<null>> {
    return this.http
      .post<BaseResponse<null>>(
        `${environment.apiUrl}/api/v1/suppliers`,
        registerSupplierRequest,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.registerToBecomeSupplier(registerSupplierRequest)
          );
        })
      );
  }

  updateSupplierProfile(
    request: UpdateSupplierProfileRequest
  ): Observable<BaseResponse<Supplier>> {
    return this.http
      .patch<BaseResponse<Supplier>>(
        `${environment.apiUrl}/api/v1/suppliers/update/profile`,
        request,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.updateSupplierProfile(request)
          );
        })
      );
  }

  updateSupplierAddress(
    request: UpdateSupplierAddressRequest
  ): Observable<BaseResponse<Supplier>> {
    return this.http
      .patch<BaseResponse<Supplier>>(
        `${environment.apiUrl}/api/v1/suppliers/update/address`,
        request,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.updateSupplierAddress(request)
          );
        })
      );
  }

  updateSupplierImages(request: any): Observable<BaseResponse<Supplier>> {
    const formData = new FormData();
    request.files.forEach((file: any) => {
      formData.append('files', file);
    });

    if (request.primaryImageIndex !== null)
      formData.append('primaryImageIndex', request.primaryImageIndex);

    return this.http
      .post<BaseResponse<Supplier>>(
        `${environment.apiUrl}/api/v1/suppliers/images/upload`,
        formData,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.updateSupplierImages(request)
          );
        })
      );
  }

  updatePrimaryImage(imageId: number): Observable<BaseResponse<SupplierImage>> {
    return this.http
      .patch<BaseResponse<SupplierImage>>(
        `${environment.apiUrl}/api/v1/suppliers/images/update/primary/${imageId}`,
        {},
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.updatePrimaryImage(imageId)
          );
        })
      );
  }

  deleteSupplierImage(
    imageId: number
  ): Observable<BaseResponse<SupplierImage>> {
    return this.http
      .delete<BaseResponse<SupplierImage>>(
        `${environment.apiUrl}/api/v1/suppliers/images/${imageId}`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.updatePrimaryImage(imageId)
          );
        })
      );
  }

  exportSupplierListToExcel(): Observable<Blob> {
    return this.http
      .get(`${environment.apiUrl}/api/v1/suppliers/export/excel`, {
        responseType: 'blob',
        headers: this.requestHeaders.headers,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.exportSupplierListToExcel()
          );
        })
      );
  }

  getSuppliersByAdmin(
    getSuppliersParams: GetSuppliersParams
  ): Observable<PaginationResponse<Supplier>> {
    const params = new HttpParams()
      .set('supplierName', getSuppliersParams.supplierName || '')
      .set(
        'supplierCategoryId',
        getSuppliersParams.supplierCategoryId?.toString() || ''
      )
      .set('province', getSuppliersParams.province || '')
      .set('isFeatured', getSuppliersParams.isFeatured?.toString() || '')
      .set('averageRating', getSuppliersParams.averageRating?.toString() || '')
      .set('minPrice', getSuppliersParams.minPrice?.toString() || '')
      .set('maxPrice', getSuppliersParams.maxPrice?.toString() || '')
      .set('status', getSuppliersParams.status || '')
      .set('sortAsc', getSuppliersParams.sortAsc?.toString() || '')
      .set('pageNumber', getSuppliersParams.pageNumber?.toString() || '1')
      .set('pageSize', getSuppliersParams.pageSize?.toString() || '10');

    return this.http
      .get<PaginationResponse<Supplier>>(
        `${environment.apiUrl}/api/v1/suppliers/admin`,
        { params, headers: this.requestHeaders.headers }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.getSuppliers(getSuppliersParams)
          );
        })
      );
  }

  updateSupplierStatus(
    supplierId: number,
    status: string
  ): Observable<BaseResponse<Supplier>> {
    return this.http
      .patch<BaseResponse<Supplier>>(
        `${environment.apiUrl}/api/v1/suppliers/status/${supplierId}?status=${status}`,
        {},
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.updateSupplierStatus(supplierId, status)
          );
        })
      );
  }

  getSupplierSocialNetworks(): Observable<
    BaseResponse<SupplierSocialNetwork[]>
  > {
    return this.http
      .get<BaseResponse<SupplierSocialNetwork[]>>(
        `${environment.apiUrl}/api/v1/suppliers/social-networks`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.getSupplierSocialNetworks()
          );
        })
      );
  }

  createSupplierSocialNetworks(
    socialNetworks: SupplierSocialNetworkRequest[]
  ): Observable<BaseResponse<SupplierSocialNetwork[]>> {
    return this.http
      .post<BaseResponse<SupplierSocialNetwork[]>>(
        `${environment.apiUrl}/api/v1/suppliers/social-networks`,
        socialNetworks,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.createSupplierSocialNetworks(socialNetworks)
          );
        })
      );
  }

  updateSupplierSocialNetworks(
    socialNetworks: SupplierSocialNetworkRequest[]
  ): Observable<BaseResponse<SupplierSocialNetwork[]>> {
    return this.http
      .put<BaseResponse<SupplierSocialNetwork[]>>(
        `${environment.apiUrl}/api/v1/suppliers/social-networks`,
        socialNetworks,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.updateSupplierSocialNetworks(socialNetworks)
          );
        })
      );
  }

  getSupplierFAQs(): Observable<BaseResponse<SupplierFAQ[]>> {
    return this.http
      .get<BaseResponse<SupplierFAQ[]>>(
        `${environment.apiUrl}/api/v1/suppliers/faqs`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.getSupplierFAQs());
        })
      );
  }

  createSupplierFAQs(
    faqs: SupplierFAQRequest[]
  ): Observable<BaseResponse<SupplierFAQ[]>> {
    return this.http
      .post<BaseResponse<SupplierFAQ[]>>(
        `${environment.apiUrl}/api/v1/suppliers/faqs`,
        faqs,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.createSupplierFAQs(faqs));
        })
      );
  }

  updateSupplierFAQs(
    faqs: SupplierFAQRequest[]
  ): Observable<BaseResponse<SupplierFAQ[]>> {
    return this.http
      .put<BaseResponse<SupplierFAQ[]>>(
        `${environment.apiUrl}/api/v1/suppliers/faqs`,
        faqs,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.updateSupplierFAQs(faqs));
        })
      );
  }

  deleteSupplierFAQ(id: number): Observable<BaseResponse<SupplierFAQ>> {
    return this.http
      .delete<BaseResponse<SupplierFAQ>>(
        `${environment.apiUrl}/api/v1/suppliers/faqs/${id}`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.deleteSupplierFAQ(id));
        })
      );
  }
}
