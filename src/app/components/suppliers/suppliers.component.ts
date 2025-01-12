import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { mockSupplierData, Supplier } from '../../models/supplier.model';
import { SupplierService } from '../../services/supplier.service';
import { PaginationResponse } from '../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { StatusService } from '../../services/status.service';
import { StatusCode } from '../../models/enums.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss',
})
export class SuppliersComponent implements OnInit {
  supplierList: Supplier[] = [];
  minPrice: number = 0;
  maxPrice: number = 10000000;
  gridLayout: boolean = false;

  constructor(
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private router: Router
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.statusService.statusLoadingSpinnerSource.next(false);
    });
    this.getMockDataSuppliers();
  }

  getSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (response: PaginationResponse<Supplier>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          this.statusService.statusLoadingSpinnerSource.next(false);
          this.supplierList = response.data.items;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
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

  formatLabel(value: number): string {
    value = Math.round(value);
    return value.toLocaleString('vi-VN') + 'đ';
  }

  btnChangeGridLayOut(flag: boolean): void {
    this.gridLayout = flag;
  }

  viewSupplierDetail(slug: string): void {
    this.router.navigate(['/suppliers', slug]);
  }
}
