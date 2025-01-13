import { Component, OnInit } from '@angular/core';
import { mockSupplierData, Supplier } from '../../models/supplier.model';
import { SupplierService } from '../../services/supplier.service';
import { ActivatedRoute } from '@angular/router';
import { BaseResponse } from '../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { StatusCode } from '../../models/enums.model';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule],
  templateUrl: './supplier-detail.component.html',
  styleUrl: './supplier-detail.component.scss',
})
export class SupplierDetailComponent implements OnInit {
  supplier: Supplier | null = null;

  constructor(
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.getSupplierInMockData(params['slug']);
    });
  }

  getSupplierBySlug(slug: string): void {
    this.supplierService.getSupplierBySlug(slug).subscribe({
      next: (response: BaseResponse<Supplier>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          this.supplier = response.data;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }

  getSupplierInMockData(slug: string): void {
    const response = mockSupplierData;
    response.data.items.map((item) => {
      if (item.slug === slug) {
        this.supplier = item;
      }
    });
  }
}
