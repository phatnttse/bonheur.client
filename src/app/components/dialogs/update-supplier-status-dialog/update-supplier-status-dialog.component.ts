import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { SupplierStatus } from '../../../models/enums.model';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Supplier } from '../../../models/supplier.model';
import { SupplierService } from '../../../services/supplier.service';
import { NotificationService } from '../../../services/notification.service';
import { StatusService } from '../../../services/status.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseResponse } from '../../../models/base.model';

@Component({
  selector: 'app-update-supplier-status-dialog',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './update-supplier-status-dialog.component.html',
  styleUrl: './update-supplier-status-dialog.component.scss',
})
export class UpdateSupplierStatusDialogComponent {
  supplierStatuses = Object.values(SupplierStatus);
  selectedStatus: SupplierStatus = SupplierStatus.PENDING;

  constructor(
    private dialogRef: MatDialogRef<UpdateSupplierStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Supplier,
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private statusService: StatusService
  ) {
    this.selectedStatus = data.status ?? SupplierStatus.APPROVED;
  }

  btnUpdateSupplierStatus() {
    if (!this.selectedStatus || !this.data) {
      this.dialogRef.close();
      this.notificationService.warning(
        'Warning',
        'Please select a valid supplier'
      );
      return;
    }

    this.statusService.statusLoadingSpinnerSource.next(true);

    this.supplierService
      .updateSupplierStatus(this.data.id, this.selectedStatus)
      .subscribe({
        next: (response: BaseResponse<Supplier>) => {
          this.statusService.statusLoadingSpinnerSource.next(false);
          this.dialogRef.close(response);
        },
        error: (error: HttpErrorResponse) => {
          this.statusService.statusLoadingSpinnerSource.next(false);
          this.dialogRef.close();
          this.notificationService.handleApiError(error);
        },
      });
  }
}
