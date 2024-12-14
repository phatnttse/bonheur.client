import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ListSupplierCategoryResponse, SupplierCategory, SupplierCategoryResponse } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';
import { NotificationService } from '../../../services/notification.service';
import { StatusService } from '../../../services/status.service';
import { StatusCode } from '../../../models/enums.model';
import { HttpErrorResponse } from '@angular/common/http';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from '../../../material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Toast, ToastrService } from 'ngx-toastr';
import { DeleteCategoryComponent } from '../../dialogs/delete-category/delete-category.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MaterialModule,
    TablerIconsModule,
  ],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss'
})
export class CategoryManagementComponent {
  @ViewChild(MatSort) sort!: MatSort;
  supplierCategories : SupplierCategory[] = [];
  dataSource: MatTableDataSource<SupplierCategory> =
  new MatTableDataSource<SupplierCategory>();
  displayedColumns: string[] = ['id','name', 'description', 'action'];
  statusPage: number = 0; 
  selectedCategory: SupplierCategory | null = null;
  categoryForm: FormGroup; 

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dialog: MatDialog
  ){
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]], 
      description: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(200)]],
    });
  }

  ngOnInit(){
    setTimeout(() => {
      this.statusService.statusLoadingSpinnerSource.next(true);
    });
    this.getCategories();
  }

  // Phương thức để kiểm tra trạng thái hợp lệ
  isInvalid(controlName: string): boolean {
    const control = this.categoryForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  //Lấy toàn bộ danh sách
  getCategories(){
    this.categoryService.getAllSupplierCategories().subscribe({
      next: (response: ListSupplierCategoryResponse) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          if (Array.isArray(response.data)) {
            this.supplierCategories = response.data;
            this.dataSource = new MatTableDataSource(this.supplierCategories);
            this.dataSource.sort = this.sort;
            this.statusService.statusLoadingSpinnerSource.next(false);
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.showToastrHandleError(error);
      },
    }
    );
  }

  // Thay đổi trạng thái của trang
  btnChangeStatusPage(status: number, category?: SupplierCategory) {
    this.statusPage = status;
    if (category) {
      this.selectedCategory = category;
      this.categoryForm.patchValue({
        name: category.name,
        description: category.description
      });
    }
  }



  //Cập nhật danh mục
  btnUpdateCategory(id: number | undefined){
    if(this.categoryForm.invalid){
      this.categoryForm.markAllAsTouched();
      return;
    }
    if (id !== undefined) {
      const name =  this.categoryForm.get('name')?.value;
      const description =  this.categoryForm.get('description')?.value;
      // Gọi dịch vụ để cập nhật danh mục
      this.categoryService.updateCategory(id,name,description)
        .subscribe({
          next: (response: SupplierCategoryResponse) => {
            this.categoryForm.reset();
            this.toastr.success('Cập nhật danh mục thành công', 'Success', {
              progressBar: true,
            });
            console.log(response.data); 
            const updatedCategory = response.data as SupplierCategory;
            const index = this.supplierCategories.findIndex(category => category.id === updatedCategory.id);
            if (index !== -1) {
              this.supplierCategories[index] = updatedCategory; 
            }            
            this.dataSource = new MatTableDataSource(this.supplierCategories);
            this.dataSource.sort = this.sort;
            this.categoryService.supplierCategoryDataSource.next(this.supplierCategories);
            this.statusPage=0;
          },
          error: (error: HttpErrorResponse) => {
            this.toastr.error('Cập nhật danh mục thất bại', 'Error');
            console.error('Error creating product: ', error);
          },
        });
    } else {
      this.toastr.warning(`Vui lòng chọn danh mục`,`WARNING`);
    }
  }
  

  //Thêm danh mục mới
  btnCreateNewCategory() {
    if(this.categoryForm.invalid){
      this.categoryForm.markAllAsTouched();
      return;
    }
      const name =  this.categoryForm.get('name')?.value;
      const description =  this.categoryForm.get('description')?.value;
      // Gọi dịch vụ để cập nhật danh mục
      this.categoryService.addNewCategory(name,description)
        .subscribe({
          next: (response: SupplierCategoryResponse) => {
            this.categoryForm.reset();
            this.toastr.success('Thêm mới danh mục thành công', 'Success', {
              progressBar: true,
            });
            console.log(response.data); 
            const newCategory = response.data as SupplierCategory;
            this.supplierCategories.push(newCategory);           
            this.dataSource = new MatTableDataSource(this.supplierCategories);
            this.dataSource.sort = this.sort;
            this.categoryService.supplierCategoryDataSource.next(this.supplierCategories);
            this.statusPage=0;
          },
          error: (error: HttpErrorResponse) => {
            this.toastr.error('Thêm mới danh mục thất bại', 'Error');
            console.error('Error creating product: ', error);
          },
        });
      }

  btnDeleteCategory(id: number){
        this.categoryService.deleteCategory(id).subscribe({
          next: (response : SupplierCategoryResponse) => {
            this.supplierCategories = this.supplierCategories.filter(category => category.id !== id);
            this.dataSource = new MatTableDataSource(this.supplierCategories);
            this.dataSource.sort = this.sort;
            this.categoryService.supplierCategoryDataSource.next(this.supplierCategories);
            this.toastr.success(`Xóa danh mục thành công!`);
          },
          error: (err : HttpErrorResponse) => {
            this.toastr.error(`${err.error.error}`, 'ERROR');
            console.log(err)
          },
        });
  }

  // Hàm để mở dialog
  openDeleteDialog(id: number): void {
    const dialogRef = this.dialog.open(DeleteCategoryComponent, {
      width: '300px',
      data: id
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      const index = this.supplierCategories.findIndex(category => category.id === id);
      if (index !== -1) {
        this.supplierCategories.splice(index, 1);

        this.dataSource = new MatTableDataSource(this.supplierCategories);
        this.dataSource.sort = this.sort;

        this.categoryService.supplierCategoryDataSource.next(this.supplierCategories);
      }
      }
    });
  }
}
