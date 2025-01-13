import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { SupplierService } from '../../../services/supplier.service';
import { Account } from '../../../models/account.model';
import { Supplier } from '../../../models/supplier.model';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';
import { BaseResponse } from '../../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';
import {
  OnBoardStatus,
  StatusCode,
  SupplierStatus,
} from '../../../models/enums.model';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [RouterModule, MatIconModule, TablerIconsModule],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss',
})
export class MainMenuComponent implements OnInit {
  account: Account | null = null;
  supplier: Supplier | null = null;
  completePercent: number = 0;
  completeStep: number = 0;
  supplierStatus: typeof SupplierStatus = SupplierStatus;

  constructor(
    private supplierService: SupplierService,
    private dataService: DataService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.dataService.supplierData$.subscribe((supplier: Supplier | null) => {
      if (supplier != null) {
        this.supplier = supplier;
        this.getCurrentStep();
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
          this.getCurrentStep();
          this.dataService.supplierDataSource.next(this.supplier);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }

  getCurrentStep() {
    if (this.supplier?.onBoardStatus === OnBoardStatus.SUPPLIER_LOCATION) {
      this.completeStep = 1;
      this.completePercent = 33.33;
    } else if (this.supplier?.onBoardStatus === OnBoardStatus.SUPPLIER_IMAGES) {
      this.completeStep = 2;
      this.completePercent = 66.67;
    } else if (this.supplier?.onBoardStatus === OnBoardStatus.COMPLETED) {
      this.completeStep = 3;
      this.completePercent = 100;
    } else {
      this.completeStep = 0;
      this.completePercent = 0;
    }
  }
}
