import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GetSuppliersParams, Supplier } from '../../../models/supplier.model';
import { DataService } from '../../../services/data.service';
import { BaseResponse, PaginationResponse } from '../../../models/base.model';
import { SupplierService } from '../../../services/supplier.service';
import { NotificationService } from '../../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  OnBoardStatus,
  StatusCode,
  SupplierStatus,
} from '../../../models/enums.model';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../../services/location.service';
import {
  ListSupplierCategoryResponse,
  SupplierCategory,
} from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';
import { FormsModule } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { UpdateSupplierStatusDialogComponent } from '../../dialogs/admin/update-supplier-status-dialog/update-supplier-status-dialog.component';

@Component({
  selector: 'app-supplier-management',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, CommonModule, FormsModule],
  templateUrl: './supplier-management.component.html',
  styleUrl: './supplier-management.component.scss',
})
export class SupplierManagementComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<Supplier> = new MatTableDataSource<Supplier>();
  displayedColumns: string[] = [
    'image',
    'name',
    'category',
    'phoneNumber',
    'status',
    'priority',
    'onBoardStatus',
    'actions',
  ];
  supplierStatus: typeof SupplierStatus = SupplierStatus;
  onBoardStatus: typeof OnBoardStatus = OnBoardStatus;
  supplierList: Supplier[] = [];
  supplierName?: string;
  supplierCategoryId?: number;
  province?: string;
  isFeatured?: boolean;
  averageRating?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: SupplierStatus;
  sortAsc?: boolean;
  valueProvince: any[] = [];
  provinceList: any[] = [];
  filteredProvinces: any[] = [];
  supplierCategories: SupplierCategory[] = [];
  supplierStatuses = Object.values(SupplierStatus);
  pageNumber: number = 1; // Trang hiện tại
  pageSize: number = 10; // Số item mỗi trang
  totalItemCount: number = 0; // Tổng số item
  pageCount: number = 0; // Tổng số trang
  isFirstPage: boolean = false; // Có phải trang đầu tiên không
  isLastPage: boolean = false; // Có phải trang cuối cùng không
  hasNextPage: boolean = false; // Có trang tiếp theo không
  hasPreviousPage: boolean = false; // Có trang trước đó không
  pageNumbers: number[] = [];

  constructor(
    private dataService: DataService,
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private locationService: LocationService,
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dataService.provinceData$.subscribe((provinceData: any) => {
      if (provinceData != null) {
        this.valueProvince = provinceData;
        this.getDetailProvinces();
      } else {
        this.getProvinces();
      }
    });
    this.dataService.supplierListData$.subscribe(
      (supplierList: Supplier[] | null) => {
        if (supplierList != null) {
          this.supplierList = supplierList;
          this.dataSource = new MatTableDataSource(this.supplierList);
          this.dataSource.sort = this.sort;
        } else {
          this.getSuppliers();
        }
      }
    );
    this.dataService.supplierCategoryData$.subscribe(
      (categories: SupplierCategory[] | null) => {
        if (categories) {
          this.supplierCategories = categories;
        } else {
          this.getSupplierCategories();
        }
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getSuppliers(): void {
    const params: GetSuppliersParams = {
      supplierName: this.supplierName,
      supplierCategoryId: this.supplierCategoryId,
      province: this.province,
      isFeatured: this.isFeatured,
      averageRating: this.averageRating,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      status: this.status,
      sortAsc: this.sortAsc,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
    this.supplierService.getSuppliersByAdmin(params).subscribe({
      next: (response: PaginationResponse<Supplier>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          this.supplierList = response.data.items;
          this.dataSource = new MatTableDataSource(this.supplierList);
          this.dataSource.sort = this.sort;
          this.totalItemCount = response.data.totalItemCount;
          this.pageCount = response.data.pageCount;
          this.isFirstPage = response.data.isFirstPage;
          this.isLastPage = response.data.isLastPage;
          this.hasNextPage = response.data.hasNextPage;
          this.hasPreviousPage = response.data.hasPreviousPage;
          this.pageNumber = response.data.pageNumber;
          this.pageSize = response.data.pageSize;
          this.pageNumbers = Array.from(
            { length: this.pageCount },
            (_, i) => i + 1
          );
          this.dataService.supplierListDataSource.next(this.supplierList);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }

  btnExportExcel() {
    this.supplierService.exportSupplierListToExcel().subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const fileName = 'SupplierList.xlsx';
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }

  filterProvinces(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.provinceList.filter((province) =>
      province.provinceName.toLowerCase().includes(filterValue)
    );
  }

  onProvinceInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.filteredProvinces = this.filterProvinces(input);
  }

  getProvinces() {
    this.locationService.getProvinces().subscribe({
      next: (response: any) => {
        this.dataService.provinceDataSource.next(response);
        this.valueProvince = response;
      },
      complete: () => {
        this.getDetailProvinces();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getDetailProvinces() {
    let setProvinces = new Set();
    this.valueProvince.forEach((response: any) => {
      if (!setProvinces.has(response.provinceId)) {
        let cloneProvince = {
          provinceName: response.provinceName,
          provinceId: response.provinceId,
        };
        this.provinceList.push(cloneProvince);
        setProvinces.add(response.provinceId);
      }
    });
    this.filteredProvinces = this.provinceList;
  }

  onProvinceChange(provinceId: string) {
    const selectedProvince = this.valueProvince.find(
      (province: any) => province.provinceId === provinceId
    );
    if (selectedProvince) {
      this.province = selectedProvince.provinceName;
    }
    this.getSuppliers();
  }

  getSupplierCategories() {
    this.categoryService.getAllSupplierCategories().subscribe({
      next: (response: ListSupplierCategoryResponse) => {
        this.dataService.supplierCategoryDataSource.next(response.data);
        this.supplierCategories = response.data;
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }

  onCategoryChange($event: MatSelectChange) {
    this.supplierCategoryId = $event.value;
    this.getSuppliers();
  }

  onFeaturedChange($event: MatSelectChange) {
    this.isFeatured = $event.value;
    this.getSuppliers();
  }

  onStatusChange($event: MatSelectChange) {
    this.status = $event.value;
    this.getSuppliers();
  }

  reloadData() {
    this.supplierName = undefined;
    this.supplierCategoryId = undefined;
    this.province = undefined;
    this.isFeatured = undefined;
    this.averageRating = undefined;
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.status = undefined;
    this.sortAsc = undefined;
    this.pageNumber = 1;
    this.pageSize = 10;
    this.getSuppliers();
  }

  openUpdateSupplierStatusDialog(supplier: Supplier) {
    const dialogRef = this.dialog.open(UpdateSupplierStatusDialogComponent, {
      data: supplier,
    });

    dialogRef.afterClosed().subscribe((result: BaseResponse<Supplier>) => {
      if (result.success && result.statusCode === StatusCode.OK) {
        this.supplierList = this.supplierList.map((supplier: Supplier) => {
          if (supplier.id === result.data.id) {
            supplier.status = result.data.status;
          }
          return supplier;
        });
        this.dataSource = new MatTableDataSource(this.supplierList);
        this.notificationService.success('Success', result.message);
      }
    });
  }

  changePage(pageNumber: number): void {
    this.pageNumber = pageNumber;
    this.getSuppliers();
  }
}
