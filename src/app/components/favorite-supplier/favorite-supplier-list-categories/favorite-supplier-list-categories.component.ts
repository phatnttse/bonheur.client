import { BaseResponse } from './../../../models/base.model';
import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import {
  ListSupplierCategoryResponse,
  SupplierCategory,
} from '../../../models/category.model';
import { MatTableDataSource } from '@angular/material/table';
import {
  FavoriteSupplier,
  PaginatedFavoriteSupplier,
} from '../../../models/favorite-supplier.model';
import { CategoryService } from '../../../services/category.service';
import { NotificationService } from '../../../services/notification.service';
import { StatusService } from '../../../services/status.service';
import { DataService } from '../../../services/data.service';
import { StatusCode } from '../../../models/enums.model';
import { HttpErrorResponse } from '@angular/common/http';
import { FavoriteSupplierService } from '../../../services/favorite-supplier.service';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorite-supplier-list-categories',
  standalone: true,
  imports: [MaterialModule, CommonModule, TablerIconsModule, RouterModule],
  templateUrl: './favorite-supplier-list-categories.component.html',
  styleUrl: './favorite-supplier-list-categories.component.scss',
})
export class FavoriteSupplierListCategoriesComponent {
  @ViewChild(MatSort) sort!: MatSort;
  supplierCategories: SupplierCategory[] = [];
  dataCategorySource: MatTableDataSource<SupplierCategory> =
    new MatTableDataSource<SupplierCategory>();
  favoriteSuppliers: FavoriteSupplier[] = [];
  dataSource: MatTableDataSource<FavoriteSupplier> =
    new MatTableDataSource<FavoriteSupplier>();
  pageNumber: number = 1; // Trang hiện tại
  pageSize: number = 8; // Số item mỗi trang
  totalItemCount: number = 0; // Tổng số item
  pageCount: number = 0; // Tổng số trang
  isFirstPage: boolean = false; // Có phải trang đầu tiên không
  isLastPage: boolean = false; // Có phải trang cuối cùng không
  hasNextPage: boolean = false; // Có trang tiếp theo không
  hasPreviousPage: boolean = false; // Có trang trước đó không
  categoryImage: string = '';
  favoriteSuppliersCategory: FavoriteSupplier[] = [];
  /**
   *
   */
  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private dataService: DataService,
    private favoriteSupplierService: FavoriteSupplierService
  ) {}

  ngOnInit() {
    this.dataService.supplierCategoryData$.subscribe(
      (categories: SupplierCategory[] | null) => {
        if (categories?.values) {
          this.supplierCategories = categories;
          this.dataCategorySource = new MatTableDataSource(
            this.supplierCategories
          );
          this.dataCategorySource.sort = this.sort;
        } else {
          this.getCategories();
        }
      }
    );
    this.dataService.favoriteSupplierData$.subscribe(
      (favoriteSuppliers: FavoriteSupplier[] | null) => {
        if (favoriteSuppliers?.values) {
          this.favoriteSuppliers = favoriteSuppliers;
          this.dataSource = new MatTableDataSource(this.favoriteSuppliers);
          this.dataSource.sort = this.sort;
        } else {
          this.getAllFavoriteSupplier(this.pageNumber, this.pageSize);
        }
      }
    );
  }

  getAllFavoriteSupplier(pageNumber: number, pageSize: number) {
    //Lấy toàn bộ danh sách
    this.favoriteSupplierService
      .getAllFavoriteSupplier(pageNumber, pageSize)
      .subscribe({
        next: (response: PaginatedFavoriteSupplier) => {
          if (response.success && response.statusCode === StatusCode.OK) {
            if (Array.isArray(response.data)) {
              this.favoriteSuppliers = response.data;
              this.dataSource = new MatTableDataSource(this.favoriteSuppliers);
              this.dataSource.sort = this.sort;
              this.pageNumber = response.data.pageNumber;
              this.pageSize = response.data.pageSize;
              this.totalItemCount = response.data.totalItemCount;
              this.isFirstPage = response.data.isFirstPage;
              this.isLastPage = response.data.isLastPage;
              this.hasNextPage = response.data.hasNextPage;
              this.hasPreviousPage = response.data.hasPreviousPage;
              this.dataService.favoriteSupplierDataSource.next(
                this.favoriteSuppliers
              );
              this.statusService.statusLoadingSpinnerSource.next(false);
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          this.statusService.statusLoadingSpinnerSource.next(false);
          this.notificationService.handleApiError(error);
        },
      });
  }

  //Lấy toàn bộ danh sách
  getCategories() {
    this.categoryService.getAllSupplierCategories().subscribe({
      next: (response: ListSupplierCategoryResponse) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          if (Array.isArray(response.data)) {
            this.supplierCategories = response.data;
            this.dataCategorySource = new MatTableDataSource(
              this.supplierCategories
            );
            this.dataCategorySource.sort = this.sort;
            this.dataService.supplierCategoryDataSource.next(
              this.supplierCategories
            );
            this.statusService.statusLoadingSpinnerSource.next(false);
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
      },
    });
  }

  hasData(categoryId: number): boolean {
    return this.favoriteSuppliers.some(
      (item) => item.supplier?.category?.id === categoryId
    );
  }

  getImageUrl(categoryId: number, favoriteSuppliers: any[]): string {
    const matchedSupplier = favoriteSuppliers.find(
      (item) => item.supplier?.category?.id === categoryId
    );
    return (
      matchedSupplier?.supplier?.images?.[0]?.imageUrl ||
      'assets/default-image.jpg'
    );
  }
}
