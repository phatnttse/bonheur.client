import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
import { Role, StatusCode } from '../../models/enums.model';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { Account } from '../../models/account.model';

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
  account: Account | null = null;
  isDoNotHaveAccount: boolean = false;
  passwordVisible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private supplierService: SupplierService,
    public authService: AuthService,
    private router: Router,
    private dataService: DataService
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
    this.dataService.supplierCategoryData$.subscribe(
      (response: SupplierCategory[] | null) => {
        if (response?.values) {
          this.supplierCategories = response;
        } else {
          this.getSupplierCategories();
        }
      }
    );

    this.dataService.accountData$.subscribe((account: Account | null) => {
      if (account != null) {
        this.account = account;
        if (this.account.roles.includes(Role.SUPPLIER)) {
          this.router.navigate(['/supplier']);
        }
      } else if (this.authService.isLoggedIn) {
        this.account = this.authService.currentUser;
        if (this.account!.roles.includes(Role.SUPPLIER)) {
          this.router.navigate(['/supplier']);
        }
      } else {
        this.isDoNotHaveAccount = true;
      }
    });

    if (this.isDoNotHaveAccount) {
      this.formContactSignup.addControl(
        'email',
        this.formBuilder.control('', [Validators.required, Validators.email])
      );
      this.formContactSignup.addControl(
        'password',
        this.formBuilder.control('', [
          Validators.required,
          Validators.minLength(6),
        ])
      );
    }
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
            if (this.isDoNotHaveAccount) {
              this.statusPage = 2;
            } else {
              this.statusPage = 1;
              setTimeout(() => {
                this.logout();
                this.notificationService.openSnackBarTop(
                  'Please login again to continue.',
                  'OK',
                  5000
                );
              }, 2000);
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          this.statusService.statusLoadingSpinnerSource.next(false);
          this.notificationService.handleApiError(error);
        },
      });
  }

  logout() {
    this.authService.logout();
    this.dataService.resetData();
    this.router.navigate(['/authentication/signin']);
  }
}
