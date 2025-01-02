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

@Component({
  selector: 'app-signup-supplier',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup-supplier.component.html',
  styleUrl: './signup-supplier.component.scss',
})
export class SignupSupplierComponent implements OnInit {
  formSignup: FormGroup;
  supplierCategories: SupplierCategory[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) {
    this.formSignup = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      phoneNumber: ['', [Validators.required]],
      supplierCategory: ['', [Validators.required]],
      websiteUrl: [''],
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

  btnSignup() {}
}
