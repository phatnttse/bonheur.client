import { AccountResponse } from './../../models/account.model';
import { AccountService } from './../../services/account.service';
import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Account } from '../../models/account.model';
import { NotificationService } from '../../services/notification.service';
import { StatusService } from '../../services/status.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { LocalStorageManager } from '../../services/localstorage-manager.service';
import { DBkeys } from '../../services/db-keys';
import { MatDialog } from '@angular/material/dialog';
import { ChangeEmailComponent } from '../dialogs/user/change-email/change-email.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  userAccount: Account | null = null;
  dataSource: MatTableDataSource<Account> = new MatTableDataSource<Account>();
  selectedFile: File | null = null;

  /**
   *
   */
  constructor(
    private userAccountService: AccountService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private dataService: DataService,
    private router: Router,
    private localStorageService: LocalStorageManager,
    private dialog: MatDialog
  ) {}
  ngOnInit() {
    this.dataService.accountData$.subscribe((account: Account | null) => {
      if (account) {
        this.userAccount = account;
      } else {
        this.getProfile();
      }
    });
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.uploadAvatar();
    }
  }

  getProfile() {
    this.userAccountService.getProfile().subscribe({
      next: (response: AccountResponse) => {
        this.userAccount = response.data;
        this.dataService.accountDataSource.next(this.userAccount);
        this.statusService.statusLoadingSpinnerSource.next(false);
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
      },
    });
  }

  uploadAvatar(): void {
    if (!this.selectedFile) {
      alert('Please select an image to upload!');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.statusService.statusLoadingSpinnerSource.next(true);
    this.userAccountService.uploadProfile(formData).subscribe({
      next: (response: AccountResponse) => {
        if (this.userAccount) {
          this.userAccount.pictureUrl = response.data.pictureUrl;
        }
        this.localStorageService.setData(this.userAccount, DBkeys.CURRENT_USER);
        this.dataService.accountDataSource.next(this.userAccount);
        this.notificationService.success('Message', response.message);
        this.statusService.statusLoadingSpinnerSource.next(false);
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
      },
    });
  }

  openChangeEmailDialog(): void {
    this.dialog.open(ChangeEmailComponent, {});
  }
}
