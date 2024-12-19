import { inject, Injectable } from '@angular/core';
import { EndpointBase } from './endpoint-base.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ConfigurationService } from './configuration.service';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import {
  ListSupplierCategoryResponse,
  SupplierCategory,
  SupplierCategoryResponse,
} from '../models/category.model';
import { environment } from '../environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends EndpointBase {
  private http = inject(HttpClient);
  public supplierCategoryDataSource = new BehaviorSubject<
    SupplierCategory[] | null
  >(null);
  supplierCategoryData$ = this.supplierCategoryDataSource.asObservable();

  getAllSupplierCategories(): Observable<ListSupplierCategoryResponse> {
    return this.http
      .get<ListSupplierCategoryResponse>(
        `${environment.apiUrl}/api/v1/suppliers/categories`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.getAllSupplierCategories());
        })
      );
  }

  getCategory(id: number): Observable<SupplierCategoryResponse> {
    return this.http
      .get<SupplierCategoryResponse>(
        `${environment.apiUrl}/api/v1/suppliers/categories/${id}`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.getCategory(id));
        })
      );
  }

  updateCategory(
    categoryId: number,
    name: string,
    description: string
  ): Observable<SupplierCategoryResponse> {
    return this.http
      .put<SupplierCategoryResponse>(
        `${environment.apiUrl}/api/v1/suppliers/categories/${categoryId}`,
        { name, description },
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.updateCategory(categoryId, name, description)
          );
        })
      );
  }

  addNewCategory(
    name: string,
    description: string
  ): Observable<SupplierCategoryResponse> {
    return this.http
      .post<SupplierCategoryResponse>(
        `${environment.apiUrl}/api/v1/suppliers/categories`,
        { name, description },
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.addNewCategory(name, description)
          );
        })
      );
  }

  deleteCategory(id: number): Observable<SupplierCategoryResponse> {
    return this.http
      .delete<SupplierCategoryResponse>(
        `${environment.apiUrl}/api/v1/suppliers/categories/${id}`,
        this.requestHeaders
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.deleteCategory(id));
        })
      );
  }
}
