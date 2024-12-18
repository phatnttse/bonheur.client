import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { BaseResponse } from '../../../models/base.model';
import { SupplierCategoryResponse } from '../../../models/category.model';

@Component({
  selector: 'app-delete-category',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, RouterModule],
  templateUrl: './delete-category.component.html',
  styleUrl: './delete-category.component.scss'
})
export class DeleteCategoryComponent {
  categoryId: number = 0;
  constructor(
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private dialogRef: MatDialogRef<DeleteCategoryComponent>,
    private notificationService: NotificationService
  ) {
    this.categoryId = data;
  }

  btnDeleteFlower() {
    if (this.categoryId > 0) {
      this.categoryService.deleteCategory(this.categoryId).subscribe({
        next: (response: SupplierCategoryResponse) => {
          this.dialogRef.close(true);
          this.notificationService.success('Success', response.message);
        },
        error: (error: HttpErrorResponse) => {
          this.dialogRef.close(false);
        },
      });
    }
  }
}
