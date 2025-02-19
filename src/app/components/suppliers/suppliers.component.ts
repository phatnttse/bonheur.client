import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
  GetSuppliersParams,
  mockSupplierData,
  Supplier,
} from '../../models/supplier.model';
import { SupplierService } from '../../services/supplier.service';
import { BaseResponse, PaginationResponse } from '../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { StatusService } from '../../services/status.service';
import { StatusCode } from '../../models/enums.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FavoriteSupplierService } from '../../services/favorite-supplier.service';
import { DataService } from '../../services/data.service';
import {
  FavoriteSupplier,
  PaginatedFavoriteSupplier,
} from '../../models/favorite-supplier.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DeleteCategoryComponent } from '../dialogs/delete-category/delete-category.component';
import { MatDialog } from '@angular/material/dialog';
import { ToolSidebarComponent } from './tool-sidebar/tool-sidebar.component';
import { Utilities } from '../../services/utilities';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ToolSidebarComponent,
  ],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss',
})
export class SuppliersComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<FavoriteSupplier> =
    new MatTableDataSource<FavoriteSupplier>();
  supplierList: Supplier[] = [];
  minPrice: number = 0;
  maxPrice: number = 0;
  gridLayout: boolean = false;
  favoriteSuppliers: FavoriteSupplier[] = [];
  pageNumber: number = 1; // Trang hiện tại
  pageSize: number = 8; // Số item mỗi trang
  totalItemCount: number = 0; // Tổng số item
  pageCount: number = 0; // Tổng số trang
  isFirstPage: boolean = false; // Có phải trang đầu tiên không
  isLastPage: boolean = false; // Có phải trang cuối cùng không
  hasNextPage: boolean = false; // Có trang tiếp theo không
  hasPreviousPage: boolean = false; // Có trang trước đó không
  search: string = ''; // Search theo tên supplier
  categoryId: number = 0; // Lọc theo category
  province: string = ''; // Lọc theo tỉnh thành
  isFeatured: boolean = false; // Lọc theo supplier nổi bật
  averageRating: number = 0; // Lọc theo rating
  sortAsc: boolean = true; // Sắp xếp tăng dần
  orderBy: string = ''; // Sắp xếp theo

  constructor(
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private router: Router,
    private dataService: DataService,
    private favoriteSupplierService: FavoriteSupplierService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.statusService.statusLoadingSpinnerSource.next(false);
    });
    this.getSuppliers();
    this.dataService.favoriteSupplierData$.subscribe(
      (favoriteSuppliers: FavoriteSupplier[] | null) => {
        if (favoriteSuppliers?.values) {
          this.favoriteSuppliers = favoriteSuppliers;
          this.dataSource = new MatTableDataSource(this.favoriteSuppliers);
          this.dataSource.sort = this.sort;
          this.cdr.detectChanges();
        } else {
          this.getAllFavoriteSupplier(this.pageNumber, this.pageSize);
        }
      }
    );
  }

  btnAddFavoriteSupplier(supplierId: number) {
    debugger;
    this.statusService.statusLoadingSpinnerSource.next(true);
    this.favoriteSupplierService.addFavoriteSupplier(supplierId).subscribe({
      next: (response: BaseResponse<FavoriteSupplier>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          // this.supplierList = mockSupplierData.data.items;
          // Kiểm tra nếu supplier đã có trong favoriteSuppliers thì không thêm nữa
          if (
            !this.favoriteSuppliers.some((fs) => fs.supplierId === supplierId)
          ) {
            this.favoriteSuppliers.push(response.data);
          }
          this.dataService.favoriteSupplierDataSource.next(
            this.favoriteSuppliers
          );
        }
        this.statusService.statusLoadingSpinnerSource.next(false);
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
      },
    });
  }

  isFavorite(supplierId: number): boolean {
    return this.favoriteSuppliers.some((fs) => fs.supplierId === supplierId);
  }

  // getSuppliers(): void {
  //   this.supplierService.getSuppliers().subscribe({
  //     next: (response: PaginationResponse<Supplier>) => {
  //       if (response.success && response.statusCode === StatusCode.OK) {
  //         this.statusService.statusLoadingSpinnerSource.next(false);
  //         this.supplierList = response.data.items;
  //       }
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       this.statusService.statusLoadingSpinnerSource.next(false);
  //       this.notificationService.handleApiError(error);
  //     },
  //   });
  // }

  getSuppliers() {
    const getSupplierParams: GetSuppliersParams = {
      supplierName: this.search,
      supplierCategoryId: this.categoryId > 0 ? this.categoryId : undefined,
      province: this.province,
      isFeatured: this.isFeatured,
      averageRating: this.averageRating,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sortAsc: this.sortAsc,
      orderBy: this.orderBy,
    };
    this.supplierService.getSuppliers(getSupplierParams).subscribe({
      next: (response: PaginationResponse<Supplier>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          this.supplierList = response.data.items;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }

  getMockDataSuppliers(): void {
    setTimeout(() => {
      const response = mockSupplierData;
      if (response.success && response.statusCode === StatusCode.OK) {
        this.supplierList = response.data.items;
        this.statusService.statusLoadingSpinnerSource.next(false);
      }
    }, 1000);
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

  openDeleteDialog(id: number): void {
    const dialogRef = this.dialog.open(DeleteCategoryComponent, {
      width: '400px',
      data: {
        id,
        deleteFn: (id: number) =>
          this.favoriteSupplierService.deleteFavoriteSupplier(id),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.favoriteSuppliers.findIndex(
          (supplier) => supplier.supplierId === id
        );
        if (index !== -1) {
          this.favoriteSuppliers.splice(index, 1);

          this.dataService.favoriteSupplierDataSource.next(
            this.favoriteSuppliers
          );
        }
      }
    });
  }

  formatLabel(value: number): string {
    return Utilities.formatVND(value);
  }

  btnChangeGridLayOut(flag: boolean): void {
    this.gridLayout = flag;
  }

  viewSupplierDetail(slug: string): void {
    this.router.navigate(['/suppliers', slug]);
  }
}
