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
import { CategoryService } from '../../../../services/category.service';
import { NotificationService } from '../../../../services/notification.service';
import { StatusService } from '../../../../services/status.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import {
  SupplierCategory,
  SupplierCategoryResponse,
} from '../../../../models/category.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-category-details-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    TablerIconsModule,
  ],
  templateUrl: './category-details-management.component.html',
  styleUrl: './category-details-management.component.scss',
})
export class CategoryDetailsManagementComponent {
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

  ngOnInit() {
    if (this.categoryId) {
      this.loadCategoryDetails(this.categoryId);
    }
    this.checkScreenWidth();
  }

  // Phương thức để lấy dữ liệu đưa lên form
  loadCategoryDetails(id: number) {
    this.categoryService.getCategory(id).subscribe({
      next: (response: SupplierCategoryResponse) => {
        const category = response.data as SupplierCategory;
        // Gắn dữ liệu lên form
        this.categoryForm.patchValue({
          name: category.name,
          description: category.description,
        });
      },
    });
  }

  // Phương thức để kiểm tra trạng thái hợp lệ
  isInvalid(controlName: string): boolean {
    const control = this.categoryForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  // Thay đổi trạng thái của trang
  btnReturnListPage() {
    this.navigateRoute.navigate(['admin', 'categories', 'management']);
  }

  //Cập nhật danh mục
  btnUpdateCategory(id: number | undefined) {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }
    if (id !== undefined) {
      const name = this.categoryForm.get('name')?.value;
      const description = this.categoryForm.get('description')?.value;
      // Gọi service để cập nhật danh mục
      this.categoryService.updateCategory(id, name, description).subscribe({
        next: (response: SupplierCategoryResponse) => {
          this.categoryForm.reset();
          this.notificationService.success('Success', response.message);
          const updatedCategory = response.data as SupplierCategory;
          const index = this.supplierCategories.findIndex(
            (category) => category.id === updatedCategory.id
          );
          if (index !== -1) {
            this.supplierCategories[index] = updatedCategory;
          }
          this.dataSource = new MatTableDataSource(this.supplierCategories);
          this.dataSource.sort = this.sort;
          this.categoryService.supplierCategoryDataSource.next(
            this.supplierCategories
          );
          this.navigateRoute.navigate(['admin', 'categories', 'management']);
        },
        error: (error: HttpErrorResponse) => {
          this.notificationService.handleApiError(error);
        },
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenWidth();
  }

  checkScreenWidth(): void {
    this.isSmallScreen = window.innerWidth < 640;
  }
}
