import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CategoryService } from '../../../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { BaseResponse } from '../../../models/base.model';
import { SupplierCategoryResponse } from '../../../models/category.model';
import { type } from 'jquery';

@Component({
  selector: 'app-delete-category',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, RouterModule],
  templateUrl: './delete-category.component.html',
  styleUrl: './delete-category.component.scss',
})
export class DeleteCategoryComponent {
  constructor(
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA)
    public data: { id: number; deleteFn: (id: number) => any },
    private dialogRef: MatDialogRef<DeleteCategoryComponent>,
    private notificationService: NotificationService
  ) {}

  btnDelete() {
    if (this.data.deleteFn && typeof this.data.deleteFn === 'function') {
      // Gọi hàm xóa từ service API
      this.data.deleteFn(this.data.id).subscribe({
        next: (response: any) => {
          // Kiểm tra loại data trả về
          if (response && response.message) {
            this.dialogRef.close(true);
            this.notificationService.success('Success', response.message);
          } else {
            this.dialogRef.close(false);
            this.notificationService.error(
              'Error',
              'Unexpected response format'
            );
          }
        },
        error: (error: HttpErrorResponse) => {
          this.dialogRef.close(false);
          this.notificationService.error(
            'Error',
            error.error.message || 'Failed to delete'
          );
        },
      });
    }
  }
}
