import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import {
  ListSupplierCategoryResponse,
  SupplierCategory,
} from '../../models/category.model';
import { NotificationService } from '../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterSupplierRequest } from '../../models/supplier.model';
import { StatusService } from '../../services/status.service';
import { SupplierService } from '../../services/supplier.service';
import { BaseResponse } from '../../models/base.model';
import { StatusCode } from '../../models/enums.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup-supplier',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup-supplier.component.html',
  styleUrl: './signup-supplier.component.scss',
})
export class SignupSupplierComponent implements OnInit {
  formContactSignup: FormGroup;
  supplierCategories: SupplierCategory[] = [];
  statusPage: number = 0; // 0: register, 1: register success

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private supplierService: SupplierService,
    public authService: AuthService
  ) {
    this.formContactSignup = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      phoneNumber: [
        '',
        [Validators.pattern(/^[0-9]{10}$/), Validators.required],
      ],
      categoryId: ['', [Validators.required]],
      websiteUrl: [''],
      acceptTerms: [false, [Validators.requiredTrue]],
    });
  }

  ngOnInit(): void {
    this.getSupplierCategories();
  }

  getSupplierCategories() {
    this.categoryService.getAllSupplierCategories().subscribe({
      next: (response: ListSupplierCategoryResponse) => {
        this.supplierCategories = response.data;
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }

  btnSignup() {
    if (this.formContactSignup.invalid) {
      this.formContactSignup.markAllAsTouched();
      if (this.formContactSignup.controls['acceptTerms'].invalid) {
        this.notificationService.warning(
          'Warning',
          'Please accept the terms and conditions'
        );
      }
      return;
    }

    this.statusService.statusLoadingSpinnerSource.next(true);

    const registerSupplierRequest: RegisterSupplierRequest = {
      ...this.formContactSignup.value,
    };

    this.supplierService
      .registerToBecomeSupplier(registerSupplierRequest)
      .subscribe({
        next: (response: BaseResponse<null>) => {
          if (response.success && response.statusCode === StatusCode.OK) {
            this.statusService.statusLoadingSpinnerSource.next(false);
            this.statusPage = 1;
          }
        },
        error: (error: HttpErrorResponse) => {
          this.statusService.statusLoadingSpinnerSource.next(false);
          this.notificationService.handleApiError(error);
        },
      });
  }
}
