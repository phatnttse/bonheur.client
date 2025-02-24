import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialModule } from '../../../../material.module';
import { AccountService } from '../../../../services/account.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-block-account',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MaterialModule, FormsModule],
  templateUrl: './block-account.component.html',
  styleUrl: './block-account.component.scss',
})
export class BlockAccountComponent {
  selectedDate!: Date;
  accountId!: string;

  constructor(
    public dialogRef: MatDialogRef<BlockAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AccountService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.accountId = this.data.accountId;
  }

  btnCloseDialog(): void {
    this.dialogRef.close();
  }

  btnBlockAccount(): void {
    if (this.selectedDate) {
      const lockoutEnd = this.selectedDate;
      const isEnable = false;

      this.accountService
        .blockAccount(this.accountId, lockoutEnd, isEnable)
        .subscribe({
          next: (response) => {
            this.notificationService.success('Success', response.message);
            this.dialogRef.close();
          },
          error: (error: HttpErrorResponse) => {
            this.notificationService.handleApiError(error);
          },
        });
    }
  }
}
