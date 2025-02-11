import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import {
  Supplier,
  UpdateSupplierProfileRequest,
} from '../../../../models/supplier.model';
import { SupplierService } from '../../../../services/supplier.service';
import { NotificationService } from '../../../../services/notification.service';
import { StatusService } from '../../../../services/status.service';
import { BaseResponse } from '../../../../models/base.model';
import { StatusCode } from '../../../../models/enums.model';
import { HttpErrorResponse } from '@angular/common/http';
import { DataService } from '../../../../services/data.service';

interface Discounts {
  discount: number;
  description: string;
}

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './deals.component.html',
  styleUrl: './deals.component.scss',
})
export class DealsComponent implements OnInit {
  discounts: Discounts[] = [
    {
      discount: 3,
      description: '3%',
    },
    {
      discount: 5,
      description: '5%',
    },
    {
      discount: 10,
      description: '10%',
    },
    {
      discount: 15,
      description: '15%',
    },
    {
      discount: 20,
      description: '20%',
    },
    {
      discount: 30,
      description: '30%',
    },
  ];
  selectedDiscount: number | null = null;
  supplier: Supplier | null = null;

  constructor(
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.dataService.supplierData$.subscribe((supplier: Supplier | null) => {
      if (supplier != null) {
        this.supplier = supplier;
        this.selectedDiscount = supplier.discount;
      }
    });
  }

  selectDiscount(discount: number) {
    this.selectedDiscount = discount;
  }

  saveDiscount() {
    if (!this.selectedDiscount) {
      this.notificationService.warning('Warning', 'Please select a discount');
      return;
    }

    this.statusService.statusLoadingSpinnerSource.next(true);

    const request: UpdateSupplierProfileRequest = {
      name: this.supplier?.name!,
      categoryId: this.supplier?.category?.id!,
      phoneNumber: this.supplier?.phoneNumber!,
      websiteUrl: this.supplier?.websiteUrl!,
      price: this.supplier?.price!,
      description: this.supplier?.description!,
      responseTime: this.supplier?.responseTime!,
      discount: this.selectedDiscount,
    };

    this.supplierService.updateSupplierProfile(request).subscribe({
      next: (response: BaseResponse<Supplier>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          this.selectedDiscount = response.data.discount;
          this.supplier = response.data;
          this.dataService.supplierDataSource.next(this.supplier);
          this.statusService.statusLoadingSpinnerSource.next(false);
          this.notificationService.success('Success', 'Discount saved');
        }
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
      },
    });
  }
}
