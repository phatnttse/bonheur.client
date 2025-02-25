import { IvyCarouselModule } from 'angular-responsive-carousel';
import { CategoryService } from './../../services/category.service';
import {
  ListSupplierCategoryResponse,
  SupplierCategory,
} from './../../models/category.model';
import {
  Component,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
} from '@angular/core';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NotificationService } from '../../services/notification.service';
import { StatusService } from '../../services/status.service';
import { DataService } from '../../services/data.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { StatusCode } from '../../models/enums.model';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FavoriteSupplier,
  PaginatedFavoriteSupplier,
} from '../../models/favorite-supplier.model';
import { FavoriteSupplierService } from '../../services/favorite-supplier.service';
import { Router, RouterModule } from '@angular/router';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorite-supplier',
  standalone: true,
  imports: [
    SlickCarouselModule,
    MaterialModule,
    TablerIconsModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './favorite-supplier.component.html',
  styleUrl: './favorite-supplier.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FavoriteSupplierComponent {
  @ViewChild('swiperContainer') swiperRef!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
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

  /**
   *
   */
  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private dataService: DataService,
    private favoriteSupplierService: FavoriteSupplierService,
    private router: Router
  ) {}

  ngOnInit() {
    this.dataService.favoriteSupplierData$.subscribe(
      (favoriteSuppliers: FavoriteSupplier[] | null) => {
        if (favoriteSuppliers !== null) {
          this.favoriteSuppliers = favoriteSuppliers;
        } else {
          this.getAllFavoriteSupplier(this.pageNumber, this.pageSize);
        }
      }
    );

    this.dataService.supplierCategoryData$.subscribe(
      (categories: SupplierCategory[] | null) => {
        if (categories !== null) {
          this.supplierCategories = categories;
        } else {
          this.getCategories();
        }
      }
    );

    // this.getCategories();
    // this.getAllFavoriteSupplier(this.pageNumber, this.pageSize);
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

  getFavoritesCount(categoryId: number): number {
    if (!this.favoriteSuppliers || !categoryId) return 0;
    return this.favoriteSuppliers.filter(
      (item) => item?.supplier?.category?.id === categoryId
    ).length;
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

  slideConfig = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          arrows: true,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          arrows: true,
        },
      },
    ],
  };
}
