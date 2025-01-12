import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
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
import { RequestPricingService } from '../../../services/request-pricing.service';
import { NotificationService } from '../../../services/notification.service';
import { RequestPricing } from '../../../models/request-pricing.model';
import { CommonModule, DatePipe } from '@angular/common';
import { event } from 'jquery';

@Component({
  selector: 'app-request-pricing-dialog',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    CommonModule,
  ],
  templateUrl: './request-pricing-dialog.component.html',
  styleUrl: './request-pricing-dialog.component.scss',
})
export class RequestPricingDialogComponent {
  requestPricingForm: FormGroup;
  isEditMode: boolean;
  constructor(
    private requestPricingService: RequestPricingService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RequestPricingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestPricing
  ) {
    if (data) {
      this.requestPricingForm = this.fb.group({
        name: [
          data.name,
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
          ],
        ],
        email: [data.email, [Validators.required, Validators.email]],
        phoneNumber: [
          data.phoneNumber,
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
          ],
        ],
        expirationDate: [data.expirationDate, Validators.required],
        eventDate: [data.eventDate, Validators.required],
        message: [data.message, Validators.required],
        rejectReason: [data.rejectReason, Validators.required],
        supplierName: [data.supplier?.name, Validators.required],
        supplierWebsiteUrl: [data.supplier?.websiteUrl, Validators.required],
      });
    } else {
      this.requestPricingForm = this.fb.group({
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
        expirationDate: ['', Validators.required],
        eventDate: ['', Validators.required],
        message: ['', Validators.required],
        rejectReason: ['', Validators.required],
        supplierName: ['', Validators.required],
        supplierWebsiteUrl: ['', Validators.required],
      });
    }
    if (this.data.id !== undefined && this.data.id > 0) {
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }
  }

  ngOnInit(): void {}

  onSubmit() {}

  onCancel() {
    this.dialogRef.close();
  }
}
