import { StatusService } from './../../../services/status.service';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { NotificationService } from '../../../services/notification.service';
import { MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { BaseResponse } from '../../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-change-email',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    CommonModule,
  ],
  templateUrl: './change-email.component.html',
  styleUrl: './change-email.component.scss',
})
export class ChangeEmailComponent {
  changeEmailForm: FormGroup;

  constructor(
    private accountService: AccountService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChangeEmailComponent>
  ) {
    this.changeEmailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.changeEmailForm.valid) {
      const email = this.changeEmailForm.get('email')?.value;
      this.statusService.statusLoadingSpinnerSource.next(true);

      this.accountService.updateEmail(email).subscribe({
        next: (response: BaseResponse<null>) => {
          this.notificationService.success('Success', response.message);
          this.statusService.statusLoadingSpinnerSource.next(false);
          this.dialogRef.close(email);
        },
        error: (error: HttpErrorResponse) => {
          this.notificationService.error('Error', error.message);
          this.statusService.statusLoadingSpinnerSource.next(false);
        },
      });
    } else {
      this.notificationService.error('Error', 'Please enter a valid email');
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
