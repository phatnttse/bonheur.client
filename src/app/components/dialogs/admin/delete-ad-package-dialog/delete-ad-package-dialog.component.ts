import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdPackageService } from '../../../../services/ad-package.service';
import { NotificationService } from '../../../../services/notification.service';
import { StatusService } from '../../../../services/status.service';
import { AdPackage } from '../../../../models/ad-package.model';
import { BaseResponse } from '../../../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-delete-ad-package-dialog',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './delete-ad-package-dialog.component.html',
  styleUrl: './delete-ad-package-dialog.component.scss',
})
export class DeleteAdPackageDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteAdPackageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private adPackageService: AdPackageService,
    private notificationService: NotificationService,
    private statusService: StatusService
  ) {}

  btnDelete() {
    debugger;
    if (!this.data) {
      this.dialogRef.close();
      this.notificationService.warning(
        'Warning',
        'Please select an ad package to delete'
      );
      return;
    }

    this.statusService.statusLoadingSpinnerSource.next(true);

    this.adPackageService.deleteAdPackage(this.data).subscribe({
      next: (response: BaseResponse<AdPackage>) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.dialogRef.close(response.data);
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.dialogRef.close();
        this.notificationService.handleApiError(error);
      },
    });
  }
}
