import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../../../material.module';
import { SupplierService } from '../../../../../services/supplier.service';
import { NotificationService } from '../../../../../services/notification.service';
import { StatusService } from '../../../../../services/status.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseResponse } from '../../../../../models/base.model';
import { SupplierVideo } from '../../../../../models/supplier.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-delete-video',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './delete-video.component.html',
  styleUrl: './delete-video.component.scss',
})
export class DeleteVideoComponent {
  constructor(
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private dialogRef: MatDialogRef<DeleteVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {}

  btnDelete() {
    this.statusService.statusLoadingSpinnerSource.next(true);
    this.supplierService.deleteVideo(this.data).subscribe({
      next: (response: BaseResponse<SupplierVideo>) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.dialogRef.close(response.data);
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
      },
    });
  }
}
