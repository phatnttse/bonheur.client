import { Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { NotificationService } from '../../../services/notification.service';
import { RequestPricingDialogComponent } from '../request-pricing-dialog/request-pricing-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Account } from '../../../models/account.model';

@Component({
  selector: 'app-account-dialog',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    CommonModule,
  ],
  templateUrl: './account-dialog.component.html',
  styleUrl: './account-dialog.component.scss',
})
export class AccountDialogComponent {
  accountForm: FormGroup;

  constructor(
    private accountService: AccountService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Account
  ) {
    if (data) {
      this.accountForm = this.fb.group({
        email: [
          data.email,
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
            Validators.email,
          ],
        ],
        fullName: [
          data.fullName,
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(100),
          ],
        ],
        gender: [
          data.gender,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ],
        ],
        isEnabled: [
          data.isEnabled,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ],
        ],
        isLockedOut: [
          data.isLockedOut,
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
          ],
        ],
        partnerName: [
          data.partnerName,
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
          ],
        ],
        phoneNumber: [
          data.phoneNumber,
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
          ],
        ],
        pictureUrl: [
          data.pictureUrl,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ],
        ],
        roles: [
          data.roles,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ],
        ],
      });
    } else {
      this.accountForm = this.fb.group({
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
          ],
        ],
        address: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(100),
          ],
        ],
        city: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ],
        ],
        state: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ],
        ],
        zipCode: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
          ],
        ],
      });
    }
  }
}
