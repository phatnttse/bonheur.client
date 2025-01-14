import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { UpdateMainPhotoDialogComponent } from '../update-main-photo-dialog/update-main-photo-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SupplierService } from '../../../services/supplier.service';
import { NotificationService } from '../../../services/notification.service';
import { BaseResponse } from '../../../models/base.model';
import { SupplierImage } from '../../../models/supplier.model';
import { StatusCode } from '../../../models/enums.model';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusService } from '../../../services/status.service';

@Component({
  selector: 'app-delete-photo-dialog',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './delete-photo-dialog.component.html',
  styleUrl: './delete-photo-dialog.component.scss',
})
export class DeletePhotoDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<UpdateMainPhotoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private statusService: StatusService
  ) {}

  btnDeletePhoto() {
    if (!this.data) {
      this.dialogRef.close();
      this.notificationService.warning(
        'Warning',
        'Please select an image to delete'
      );
      return;
    }

    this.statusService.statusLoadingSpinnerSource.next(true);

    this.supplierService.deleteSupplierImage(this.data).subscribe({
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
