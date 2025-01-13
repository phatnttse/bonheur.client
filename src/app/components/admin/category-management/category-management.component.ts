import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  ListSupplierCategoryResponse,
  SupplierCategory,
  SupplierCategoryResponse,
} from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';
import { NotificationService } from '../../../services/notification.service';
import { StatusService } from '../../../services/status.service';
import { StatusCode } from '../../../models/enums.model';
import { HttpErrorResponse } from '@angular/common/http';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Toast, ToastrService } from 'ngx-toastr';
import { DeleteCategoryComponent } from '../../dialogs/delete-category/delete-category.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { Router, RouterModule } from '@angular/router';
import { SupplierCategoryDialogComponent } from '../../dialogs/supplier-category-dialog/supplier-category-dialog.component';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    TablerIconsModule,
    RouterModule,
  ],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss',
})
export class CategoryManagementComponent {
  @ViewChild(MatSort) sort!: MatSort;
  supplierCategories: SupplierCategory[] = [];
  dataSource: MatTableDataSource<SupplierCategory> =
    new MatTableDataSource<SupplierCategory>();
  displayedColumns: string[] = ['id', 'name', 'description', 'action'];
  statusPage: number = 0;
  selectedCategory: SupplierCategory | null = null;
  categoryForm: FormGroup;

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private route: Router,
    private dataService: DataService
  ) {
    this.categoryForm = this.fb.group({
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
    setTimeout(() => {
      this.dataService.supplierCategoryDataSource.next(this.supplierCategories);
    }, 0);
  }

  ngOnInit() {
    setTimeout(() => {
      // this.statusService.statusLoadingSpinnerSource.next(true);
    });

    this.dataService.supplierCategoryData$.subscribe(
      (categories: SupplierCategory[] | null) => {
        if (categories?.values) {
          this.supplierCategories = categories;
          this.dataSource = new MatTableDataSource(this.supplierCategories);
          this.dataSource.sort = this.sort;
        } else {
          this.getCategories();
        }
      }
    );
  }

  // Phương thức để kiểm tra trạng thái hợp lệ
  isInvalid(controlName: string): boolean {
    const control = this.categoryForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  //Lấy toàn bộ danh sách
  getCategories() {
    this.categoryService.getAllSupplierCategories().subscribe({
      next: (response: ListSupplierCategoryResponse) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          if (Array.isArray(response.data)) {
            this.supplierCategories = response.data;
            this.dataSource = new MatTableDataSource(this.supplierCategories);
            this.dataSource.sort = this.sort;
            this.dataService.supplierCategoryDataSource.next(
              this.supplierCategories
            );
            this.statusService.statusLoadingSpinnerSource.next(false);
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
      },
    });
  }

  btnDeleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe({
      next: (response: SupplierCategoryResponse) => {
        this.supplierCategories = this.supplierCategories.filter(
          (category) => category.id !== id
        );
        this.dataSource = new MatTableDataSource(this.supplierCategories);
        this.dataSource.sort = this.sort;
        this.dataService.supplierCategoryDataSource.next(
          this.supplierCategories
        );
        this.notificationService.success('Success', response.message);
      },
      error: (err: HttpErrorResponse) => {
        this.notificationService.handleApiError(err);
      },
    });
  }

  // Hàm để mở dialog
  openDeleteDialog(id: number): void {
    const dialogRef = this.dialog.open(DeleteCategoryComponent, {
      width: '400px',
      data: {
        id,
        deleteFn: (id: number) => this.categoryService.deleteCategory(id),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.supplierCategories.findIndex(
          (category) => category.id === id
        );
        if (index !== -1) {
          this.supplierCategories.splice(index, 1);

          this.dataSource = new MatTableDataSource(this.supplierCategories);
          this.dataSource.sort = this.sort;

          this.dataService.supplierCategoryDataSource.next(
            this.supplierCategories
          );
        }
      }
    });
  }

  openDialog(id?: number) {
    let selectedCategory;

    if (id) {
      selectedCategory = this.supplierCategories.find((sp) => sp.id === id);
    } else {
      selectedCategory = {};
    }

    const dialogRef = this.dialog.open(SupplierCategoryDialogComponent, {
      data: selectedCategory,
    });

    dialogRef.afterClosed().subscribe((result: SupplierCategory) => {
      if (result) {
        const index = this.supplierCategories.findIndex(
          (item) => item.id === result.id
        );
        if (index !== -1) {
          this.supplierCategories[index] = result;
        } else {
          this.supplierCategories.push(result);
        }

        this.dataService.supplierCategoryDataSource.next(
          this.supplierCategories
        );
      }
    });
  }
}
