import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaterialModule } from '../../../../../material.module';
import { CommonModule } from '@angular/common';
import { SocialNetworkService } from '../../../../../services/social-networks.service';
import { NotificationService } from '../../../../../services/notification.service';
import { BaseResponse } from '../../../../../models/base.model';
import { SocialNetwork } from '../../../../../models/social-network';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusService } from '../../../../../services/status.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-social-network-details',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './social-network-details.component.html',
  styleUrl: './social-network-details.component.scss',
})
export class SocialNetworkDetailsComponent implements OnInit {
  form: FormGroup;
  file: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private socialNetworkService: SocialNetworkService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private dialogRef: MatDialogRef<SocialNetworkDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SocialNetwork
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue({
        name: this.data.name,
      });
      this.imagePreview = this.data.imageUrl;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.file!.type === 'image/svg+xml';
      };

      reader.readAsDataURL(this.file);
    }
  }

  createSocialNetwork() {
    if (this.form.invalid || (!this.file && !this.data)) {
      this.notificationService.warning(
        'Warning',
        'Please fill all required fields and upload an image'
      );
      return;
    }

    this.statusService.statusLoadingSpinnerSource.next(true);
    const name = this.form.get('name')?.value;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', this.file!);

    this.socialNetworkService.createSocialNetwork(formData).subscribe({
      next: (response: BaseResponse<SocialNetwork>) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.success('Success', response.message);
        this.dialogRef.close(response.data);
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
        this.dialogRef.close();
      },
    });
  }

  updateSocialNetwork() {
    if (this.form.invalid) {
      this.notificationService.warning(
        'Warning',
        'Please fill all required fields and upload an image'
      );
      return;
    }

    this.statusService.statusLoadingSpinnerSource.next(true);
    const name = this.form.get('name')?.value;

    const formData = new FormData();
    formData.append('name', name);

    if (this.file) formData.append('file', this.file);

    this.socialNetworkService
      .updateSocialNetwork(this.data.id, formData)
      .subscribe({
        next: (response: BaseResponse<SocialNetwork>) => {
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
