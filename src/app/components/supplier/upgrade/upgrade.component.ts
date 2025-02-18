import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { SubscriptionPackage } from '../../../models/subscription-packages.model';
import { DataService } from '../../../services/data.service';
import { NotificationService } from '../../../services/notification.service';
import { StatusService } from '../../../services/status.service';
import { SubscriptionPackagesService } from '../../../services/subscription-packages.service';
import { BaseResponse } from '../../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../services/payment.service';
import { StatusCode } from '../../../models/enums.model';
import {
  CreatePaymentResult,
  CreateSpPaymentLinkRequest,
} from '../../../models/payment.model';

@Component({
  selector: 'app-upgrade',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './upgrade.component.html',
  styleUrl: './upgrade.component.scss',
})
export class UpgradeComponent implements OnInit {
  subscriptionPackages: SubscriptionPackage[] = [];

  constructor(
    private dataService: DataService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private subscriptionPackageService: SubscriptionPackagesService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.dataService.subscriptionPackagesData$.subscribe(
      (data: SubscriptionPackage[] | null) => {
        if (data?.values) {
          this.subscriptionPackages = data;
        } else {
          this.getSubscriptionPackages();
        }
      }
    );
  }

  getSubscriptionPackages(): void {
    this.subscriptionPackageService.getSubscriptionPackages().subscribe({
      next: (response: BaseResponse<SubscriptionPackage[]>) => {
        this.subscriptionPackages = response.data;
        this.dataService.subscriptionPackagesDataSource.next(
          this.subscriptionPackages
        );
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }

  payForSubscription(subscriptionId: number): void {
    const request: CreateSpPaymentLinkRequest = {
      spId: subscriptionId,
    };
    this.statusService.statusLoadingSpinnerSource.next(true);
    this.paymentService.payForSubscription(request).subscribe({
      next: (response: BaseResponse<CreatePaymentResult>) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        if (response.success && response.statusCode === StatusCode.Created) {
          window.location.href = response.data.checkoutUrl;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
      },
    });
  }
}
