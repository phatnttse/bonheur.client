import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountService } from '../../../services/account.service';
import { NotificationService } from '../../../services/notification.service';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-unblock-account',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './unblock-account.component.html',
  styleUrl: './unblock-account.component.scss'
})
export class UnblockAccountComponent {
  accountId!: string;

  constructor(
    public dialogRef: MatDialogRef<UnblockAccountComponent>,
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

  btnUnblockAccount(): void {
      const lockoutEnd = new Date();
      const isEnable = false;  

      this.accountService.blockAccount(this.accountId, lockoutEnd, isEnable).subscribe({
        next: (response) => {
          this.notificationService.success('Thành công','Tài khoản đã mở khóa thành công khóa thành công');
          this.dialogRef.close();  
        },
        error: (error) => {
          this.notificationService.error('Error','Lỗi khi mở khóa tài khoản');
        }
      });
    }
  }

