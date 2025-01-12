import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { SubscriptionPackagesService } from '../../../services/subscription-packages.service';
import { NotificationService } from '../../../services/notification.service';
import { StatusService } from '../../../services/status.service';
import { MaterialModule } from '../../../material.module';
import {
  Form,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  SubscriptionPackage,
  SubscriptionPackageResponse,
} from '../../../models/subscription-packages.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-subscription-package-dialog',
  standalone: true,
  imports: [RouterModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './subscription-package-dialog.component.html',
  styleUrl: './subscription-package-dialog.component.scss',
})
export class SubscriptionPackageDialogComponent {
  subscriptionForm: FormGroup;
  isEditMode: boolean;
  constructor(
    private subscriptionPackagesService: SubscriptionPackagesService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SubscriptionPackageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubscriptionPackage
  ) {
    this.subscriptionForm = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      description: [this.data?.description || '', Validators.required],
      durationInDays: [
        this.data?.durationInDays || 0,
        [Validators.required, Validators.min(1)],
      ],
      price: [this.data?.price || 0, [Validators.required, Validators.min(0)]],
      isFeatured: [this.data?.isFeatured || false],
      priority: [this.data?.priority || 0, Validators.required],
      isDeleted: [this.data?.isDeleted || false],
    });
    if (this.data.id !== undefined && this.data.id > 0) {
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.subscriptionForm.invalid) {
      this.subscriptionForm.markAllAsTouched();
      return;
    }

    this.statusService.statusLoadingSpinnerSource.next(true);

    const formData: SubscriptionPackage = this.subscriptionForm.value;

    if (this.isEditMode && this.data.id) {
      this.subscriptionPackagesService
        .updateSubscriptionPackage(this.data.id, formData)
        .subscribe({
          next: (response: SubscriptionPackageResponse) => {
            this.statusService.statusLoadingSpinnerSource.next(false);
            this.notificationService.success('Success', response.message);
            this.dialogRef.close(response.data);
          },
          error: (error: HttpErrorResponse) => {
            this.statusService.statusLoadingSpinnerSource.next(false);
            this.notificationService.handleApiError(error);
          },
        });
    } else {
      this.subscriptionPackagesService
        .createSubscriptionPackage(formData)
        .subscribe({
          next: (response: SubscriptionPackageResponse) => {
            this.statusService.statusLoadingSpinnerSource.next(false);
            this.notificationService.success('Success', response.message);
            this.dialogRef.close(response.data);
          },
          error: (error: HttpErrorResponse) => {
            this.statusService.statusLoadingSpinnerSource.next(false);
            this.notificationService.handleApiError(error);
          },
        });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  addDurationDays(event: MouseEvent): void {
    event.preventDefault();
    const durationInDays = this.subscriptionForm.get('durationInDays');
    if (durationInDays) {
      const currentValue = durationInDays.value;
      durationInDays.setValue(currentValue + 1); // Tăng giá trị lên 1
    }
  }

  subtractDurationDays(event: MouseEvent): void {
    event.preventDefault();
    const durationInDays = this.subscriptionForm.get('durationInDays');
    if (durationInDays) {
      const currentValue = durationInDays.value;
      durationInDays.setValue(currentValue - 1);
    }
  }
}
