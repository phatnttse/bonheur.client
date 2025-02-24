import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequestPricingService } from '../../../../services/request-pricing.service';
import {
  CreateRequestPricing,
  RequestPricingResponse,
} from '../../../../models/request-pricing.model';
import { Supplier } from '../../../../models/supplier.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../../services/notification.service';
import { StatusService } from '../../../../services/status.service';
import { Account } from '../../../../models/account.model';
import { AuthService } from '../../../../services/auth.service';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-request-pricing-dialog',
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './request-pricing-dialog.component.html',
  styleUrl: './request-pricing-dialog.component.scss',
})
export class RequestPricingDialogComponent implements OnInit {
  requestPricingForm: FormGroup;
  account: Account | null = null;
  status: boolean = false; // Check request success or not yet

  constructor(
    private dialogRef: MatDialogRef<RequestPricingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Supplier,
    private formBuilder: FormBuilder,
    private requestPricingService: RequestPricingService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private authService: AuthService,
    private dataService: DataService
  ) {
    this.requestPricingForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[0-9]{10}$/), Validators.required]],
      message: [
        "Hello! We'd love to get more information about your packages and services. Looking forward to hearing from you!",
        [Validators.required],
      ],
      eventDate: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.dataService.accountData$.subscribe((account: Account | null) => {
      if (account) {
        this.account = account;
        this.requestPricingForm.patchValue({
          name: this.account?.fullName,
          email: this.account?.email,
          phone: this.account?.phoneNumber,
        });
      } else {
        this.account = this.authService.currentUser;
        this.requestPricingForm.patchValue({
          name: this.account?.fullName,
          email: this.account?.email,
          phone: this.account?.phoneNumber,
        });
      }
    });
  }

  onSubmit(): void {
    if (this.requestPricingForm.invalid) {
      this.requestPricingForm.markAllAsTouched();
      return;
    }
    this.statusService.statusLoadingSpinnerSource.next(true);

    const request: CreateRequestPricing = {
      name: this.requestPricingForm.value.name,
      email: this.requestPricingForm.value.email,
      phoneNumber: this.requestPricingForm.value.phone,
      message: this.requestPricingForm.value.message,
      eventDate: this.requestPricingForm.value.eventDate,
      supplierId: this.data.id,
    };

    this.requestPricingService.createRequestPricing(request).subscribe({
      next: (response: RequestPricingResponse) => {
        if (response.success) {
          setTimeout(() => {
            this.statusService.statusLoadingSpinnerSource.next(false);
            this.status = true;
          }, 500);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
      },
    });
  }
}
