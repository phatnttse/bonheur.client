import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Supplier } from '../../../models/supplier.model';
import { CategoryService } from '../../../services/category.service';
import { NotificationService } from '../../../services/notification.service';
import {
  SupplierCategory,
  SupplierCategoryResponse,
} from '../../../models/category.model';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-supplier-category-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  templateUrl: './supplier-category-dialog.component.html',
  styleUrl: './supplier-category-dialog.component.scss',
})
export class SupplierCategoryDialogComponent {
  supplierCategoryForm: FormGroup;
  isEditMode: boolean;
  constructor(
    private supplierCategoryService: CategoryService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SupplierCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SupplierCategory
  ) {
    if (data) {
      this.supplierCategoryForm = this.fb.group({
        name: [
          data.name,
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
          ],
        ],
        description: [
          data.description,
          [
            Validators.required,
            Validators.minLength(15),
            Validators.maxLength(200),
          ],
        ],
      });
    } else {
      this.supplierCategoryForm = this.fb.group({
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
          ],
        ],
        description: [
          '',
          [
            Validators.required,
            Validators.minLength(15),
            Validators.maxLength(200),
          ],
        ],
      });
    }

    this.isEditMode = !!data;
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.supplierCategoryForm.invalid) {
      this.supplierCategoryForm.markAllAsTouched();
      return;
    }
    if (this.data.id !== undefined) {
      const name = this.supplierCategoryForm.get('name')?.value;
      const description = this.supplierCategoryForm.get('description')?.value;

      this.supplierCategoryService
        .updateCategory(this.data.id, name, description)
        .subscribe({
          next: (response: SupplierCategoryResponse) => {
            this.notificationService.success('Success', response.message);
            this.dialogRef.close(true);
          },
          error: (error: HttpErrorResponse) => {
            this.notificationService.handleApiError(error);
          },
        });
    } else {
      const name = this.supplierCategoryForm.get('name')?.value;
      const description = this.supplierCategoryForm.get('description')?.value;

      this.supplierCategoryService.addNewCategory(name, description).subscribe({
        next: (response: SupplierCategoryResponse) => {
          this.notificationService.success('Success', response.message);
          this.dialogRef.close(true);
        },
        error: (error: HttpErrorResponse) => {
          this.notificationService.handleApiError(error);
        },
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
