import { Component, OnInit } from '@angular/core';
import { SubscriptionPackage } from '../../../../models/subscription-packages.model';
import { SupplierService } from '../../../../services/supplier.service';
import { NotificationService } from '../../../../services/notification.service';
import { StatusService } from '../../../../services/status.service';
import { DataService } from '../../../../services/data.service';
import { AuthService } from '../../../../services/auth.service';
import { Supplier } from '../../../../models/supplier.model';
import { BaseResponse } from '../../../../models/base.model';
import { StatusCode } from '../../../../models/enums.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Account } from '../../../../models/account.model';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import { VNDCurrencyPipe } from '../../../../pipes/vnd-currency.pipe';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [MaterialModule, CommonModule, VNDCurrencyPipe],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss',
})
export class SubscriptionsComponent implements OnInit {
  subscriptionPackage: SubscriptionPackage | null = null;
  supplier: Supplier | null = null;
  account: Account | null = null;

  constructor(
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.dataService.supplierData$.subscribe((supplier: Supplier | null) => {
      if (supplier != null) {
        this.supplier = supplier;
        this.subscriptionPackage = supplier.subscriptionPackage || null;
      } else {
        if (this.authService.currentUser) {
          this.account = this.authService.currentUser;
          this.getSupplierByUserId(this.account.id);
        }
      }
    });
  }

  getSupplierByUserId(userId: string) {
    this.supplierService.getSupplierByUserId(userId).subscribe({
      next: (response: BaseResponse<Supplier>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          this.supplier = response.data;
          this.subscriptionPackage = this.supplier.subscriptionPackage || null;
          this.dataService.supplierDataSource.next(this.supplier);
          this.statusService.statusLoadingSpinnerSource.next(false);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }
}
