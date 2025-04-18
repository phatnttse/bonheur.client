import { catchError } from 'rxjs';
import { Component, Input, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatSort } from '@angular/material/sort';
import {
  ListSupplierCategoryResponse,
  SupplierCategory,
} from '../../../models/category.model';
import { MatTableDataSource } from '@angular/material/table';
import {
  BaseFavoriteCount,
  FavoriteCount,
  FavoriteSupplier,
  PaginatedFavoriteSupplier,
} from '../../../models/favorite-supplier.model';
import { CategoryService } from '../../../services/category.service';
import { NotificationService } from '../../../services/notification.service';
import { StatusService } from '../../../services/status.service';
import { DataService } from '../../../services/data.service';
import { FavoriteSupplierService } from '../../../services/favorite-supplier.service';
import { StatusCode } from '../../../models/enums.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BaseResponse } from '../../../models/base.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { VNDCurrencyPipe } from '../../../pipes/vnd-currency.pipe';

@Component({
  selector: 'app-favorite-supplier-category',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    TablerIconsModule,
    FontAwesomeModule,
    VNDCurrencyPipe,
  ],
  templateUrl: './favorite-supplier-category.component.html',
  styleUrl: './favorite-supplier-category.component.scss',
})
export class FavoriteSupplierCategoryComponent {
  supplierCategories: SupplierCategory[] = [];

  favoriteSuppliers: FavoriteSupplier[] = [];

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
  favoriteCount: FavoriteCount[] = [];
  faStar = faStar;

  @Input() rating: number = 0;
  @Input() readonly: boolean = false;

  setRating(value: number) {
    if (this.readonly) return;
    this.rating = value;
  }
  /**
   *
   */
  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private dataService: DataService,
    private favoriteSupplierService: FavoriteSupplierService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.dataService.supplierCategoryData$.subscribe(
      (categories: SupplierCategory[] | null) => {
        if (categories?.values) {
          this.supplierCategories = categories;
        } else {
          this.getCategories();
        }
      }
    );
    this.route.params.subscribe((params) => {
      const categoryId = +params['categoryId'];
      this.getAllFavoriteSupplierByCategory(
        categoryId,
        this.pageNumber,
        this.pageSize
      );
    });
    this.loadFavoriteCount();
  }

  getAllFavoriteSupplierByCategory(
    categoryId: number,
    pageNumber: number,
    pageSize: number
  ) {
    //Lấy toàn bộ danh sách
    this.favoriteSupplierService
      .getFavoriteSupplierByCategory(categoryId, pageNumber, pageSize)
      .subscribe({
        next: (response: PaginatedFavoriteSupplier) => {
          if (response.success && response.statusCode === StatusCode.OK) {
            if (Array.isArray(response.data)) {
              this.favoriteSuppliers = response.data;
              this.pageNumber = response.data.pageNumber;
              this.pageSize = response.data.pageSize;
              this.totalItemCount = response.data.totalItemCount;
              this.isFirstPage = response.data.isFirstPage;
              this.isLastPage = response.data.isLastPage;
              this.hasNextPage = response.data.hasNextPage;
              this.hasPreviousPage = response.data.hasPreviousPage;
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

  private checkAndRedirect() {
    const hasSuppliersInCurrentCategory = this.favoriteSuppliers.some(
      (supplier) =>
        supplier.supplier?.category?.id ===
        this.favoriteSuppliers[0]?.supplier?.category?.id
    );

    if (!hasSuppliersInCurrentCategory) {
      this.router.navigate(['/suppliers']);
    }
  }

  loadFavoriteCount(): void {
    this.favoriteSupplierService.favoriteCount().subscribe({
      next: (response: BaseFavoriteCount) => {
        // Xử lý dữ liệu tùy theo format API trả về
        if (response.success && response.statusCode === StatusCode.OK) {
          this.favoriteCount = response.data;
          console.log('Favorite count:', this.favoriteCount);
        }
      },
      error: (error) => {
        console.error('Error loading favorite count:', error);
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

  groupSuppliersByCategory() {
    return this.supplierCategories.map((category) => {
      const suppliers = this.favoriteSuppliers.filter(
        (item) => item.supplier?.category?.id === category.id
      );
      return {
        category,
        suppliers,
        count: suppliers.length,
      };
    });
  }

  deleteFavoriteSupplier(id: number): void {
    this.statusService.statusLoadingSpinnerSource.next(true);

    this.favoriteSupplierService.deleteFavoriteSupplier(id).subscribe({
      next: (response: BaseResponse<FavoriteSupplier>) => {
        const index = this.favoriteSuppliers.findIndex(
          (supplier) => supplier.supplierId === id
        );
        if (index !== -1) {
          this.favoriteSuppliers.splice(index, 1);
        }

        const currentFavorites =
          this.dataService.favoriteSupplierDataSource.getValue();
        const updatedFavorites = currentFavorites
          ? currentFavorites.filter((supplier) => supplier.supplierId !== id)
          : [];
        this.dataService.favoriteSupplierDataSource.next(updatedFavorites);

        this.notificationService.success('Success', response.message);
        this.statusService.statusLoadingSpinnerSource.next(false);

        this.checkAndRedirect();
      },
      error: (err: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.error('Error', err.message);
      },
    });
  }
}
