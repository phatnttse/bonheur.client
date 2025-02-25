import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SupplierService } from '../../../../services/supplier.service';
import { NotificationService } from '../../../../services/notification.service';
import { BaseResponse } from '../../../../models/base.model';
import { SupplierImage } from '../../../../models/supplier.model';
import { StatusCode } from '../../../../models/enums.model';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusService } from '../../../../services/status.service';

@Component({
  selector: 'app-update-main-photo-dialog',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './update-main-photo-dialog.component.html',
  styleUrl: './update-main-photo-dialog.component.scss',
})
export class UpdateMainPhotoDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<UpdateMainPhotoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private statusService: StatusService
  ) {}

  btnUpdateMainPhoto() {
    if (!this.data) {
      this.dialogRef.close();
      this.notificationService.warning(
        'Warning',
        'Please select an image to update as main photo'
      );
      return;
    }

    this.statusService.statusLoadingSpinnerSource.next(true);

    this.supplierService.updatePrimaryImage(this.data).subscribe({
      next: (response: BaseResponse<SupplierImage>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          this.statusService.statusLoadingSpinnerSource.next(false);
          this.dialogRef.close(response.data);
        } else {
          this.statusService.statusLoadingSpinnerSource.next(false);
          this.dialogRef.close();
          this.notificationService.error('Error', response.message);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.dialogRef.close();
        this.notificationService.handleApiError(error);
      },
    });
  }
}
