import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  AdPackage,
  AdPackageRequest,
} from '../../../../models/ad-package.model';
import { AdType } from '../../../../models/enums.model';
import { StatusService } from '../../../../services/status.service';
import { AdPackageService } from '../../../../services/ad-package.service';
import { NotificationService } from '../../../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseResponse } from '../../../../models/base.model';

@Component({
  selector: 'app-ad-package-dialog',
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './ad-package-dialog.component.html',
  styleUrl: './ad-package-dialog.component.scss',
})
export class AdPackageDialogComponent {
  adPackageForm: FormGroup;
  isEditMode: boolean = false;
  adTypes = Object.values(AdType);

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AdPackageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AdPackage,
    private statusService: StatusService,
    private adPackageService: AdPackageService,
    private notificationService: NotificationService
  ) {
    this.adPackageForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      adType: ['', [Validators.required]],
      isActive: [true, [Validators.required]],
    });

    if (this.data !== null) {
      this.isEditMode = true;
      this.adPackageForm.patchValue({
        title: this.data.title,
        description: this.data.description,
        price: this.data.price,
        startDate: this.data.startDate,
        endDate: this.data.endDate,
        adType: this.data.adType,
        isActive: this.data.isActive,
      });
    } else {
      this.isEditMode = false;
    }
  }

  onSubmit(): void {
    debugger;
    if (this.adPackageForm.invalid) {
      this.adPackageForm.markAllAsTouched();
      return;
    }

    this.statusService.statusLoadingSpinnerSource.next(true);

    const request: AdPackageRequest = {
      title: this.adPackageForm.value.title,
      description: this.adPackageForm.value.description,
      price: this.adPackageForm.value.price,
      startDate: this.adPackageForm.value.startDate,
      endDate: this.adPackageForm.value.endDate,
      adType: this.adPackageForm.value.adType,
      isActive: this.adPackageForm.value.isActive,
    };

    this.adPackageService.createAdPackage(request).subscribe({
      next: (response: BaseResponse<AdPackage>) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.dialogRef.close(response.data);
        this.notificationService.success('Success', response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
      },
    });
  }
}
