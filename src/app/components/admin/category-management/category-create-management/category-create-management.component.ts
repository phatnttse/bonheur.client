import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaterialModule } from '../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatSort } from '@angular/material/sort';
import {
  SupplierCategory,
  SupplierCategoryResponse,
} from '../../../../models/category.model';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from '../../../../services/category.service';
import { NotificationService } from '../../../../services/notification.service';
import { StatusService } from '../../../../services/status.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-category-create-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    TablerIconsModule,
  ],
  templateUrl: './category-create-management.component.html',
  styleUrl: './category-create-management.component.scss',
})
export class CategoryCreateManagementComponent {
  @ViewChild(MatSort) sort!: MatSort;
  supplierCategories: SupplierCategory[] = [];
  dataSource: MatTableDataSource<SupplierCategory> =
    new MatTableDataSource<SupplierCategory>();
  categoryForm: FormGroup;
  categoryId: number | null = null;
  isSmallScreen: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private navigateRoute: Router
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
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.categoryId = id !== null ? +id : null;
    });
  }

  ngOnInit() {}

  // Phương thức để kiểm tra trạng thái hợp lệ
  isInvalid(controlName: string): boolean {
    const control = this.categoryForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  // Thay đổi trạng thái của trang
  btnReturnListPage() {
    this.navigateRoute.navigate(['admin', 'categories', 'management']);
  }

  //Thêm danh mục mới
  btnCreateNewCategory() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }
    const name = this.categoryForm.get('name')?.value;
    const description = this.categoryForm.get('description')?.value;
    // Gọi dịch vụ để cập nhật danh mục
    this.categoryService.addNewCategory(name, description).subscribe({
      next: (response: SupplierCategoryResponse) => {
        this.categoryForm.reset();
        this.notificationService.success('Success', response.message);
        console.log(response.data);
        const newCategory = response.data as SupplierCategory;
        this.supplierCategories.push(newCategory);
        this.dataSource = new MatTableDataSource(this.supplierCategories);
        this.dataSource.sort = this.sort;
        this.categoryService.supplierCategoryDataSource.next(
          this.supplierCategories
        );
        this.navigateRoute.navigate(['admin', 'categories', 'management']);
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
        console.error('Error creating product: ', error);
      },
    });
  }
}
