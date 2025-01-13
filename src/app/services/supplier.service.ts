import { inject, Injectable } from '@angular/core';
import { EndpointBase } from './endpoint-base.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../environments/environment.dev';
import { BaseResponse, PaginationResponse } from '../models/base.model';
import {
  RegisterSupplierRequest,
  Supplier,
  SupplierImage,
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
}
