import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../../../material.module';
import { SupplierService } from '../../../../../services/supplier.service';
import { NotificationService } from '../../../../../services/notification.service';
import { StatusService } from '../../../../../services/status.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseResponse } from '../../../../../models/base.model';
import { SupplierFAQ } from '../../../../../models/supplier.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-delete-faq',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './delete-faq.component.html',
  styleUrl: './delete-faq.component.scss',
})
export class DeleteFaqComponent {
  constructor(
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private dialogRef: MatDialogRef<DeleteFaqComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {}

  btnDelete() {
    this.statusService.statusLoadingSpinnerSource.next(true);
    this.supplierService.deleteSupplierFAQ(this.data).subscribe({
      next: (response: BaseResponse<SupplierFAQ>) => {
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
