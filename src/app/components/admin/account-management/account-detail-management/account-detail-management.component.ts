import { Component } from '@angular/core';
import { Account, AccountResponse } from '../../../../models/account.model';
import { NotificationService } from '../../../../services/notification.service';
import { AccountService } from '../../../../services/account.service';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusService } from '../../../../services/status.service';
import { MaterialModule } from '../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlockAccountComponent } from '../../../dialogs/block-account/block-account.component';
import { UnblockAccountComponent } from '../../../dialogs/unblock-account/unblock-account.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-account-detail-management',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, CommonModule],
  templateUrl: './account-detail-management.component.html',
  styleUrl: './account-detail-management.component.scss',
})
export class AccountDetailManagementComponent {
  account: Account | null = null;
  accountId: string | null = null;

  constructor(
    private notificationService: NotificationService,
    private accountService: AccountService,
    private statusService: StatusService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.route.paramMap.subscribe((params) => {
      this.accountId = params.get('id');
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.statusService.statusLoadingSpinnerSource.next(true);
    });

    if (this.accountId) {
      this.getAccount(this.accountId);
    }
  }

  getAccount(id: string) {
    this.accountService.getAccount(id).subscribe({
      next: (response: AccountResponse) => {
        const data = response.data as Account;
        this.account = data;
        this.statusService.statusLoadingSpinnerSource.next(false);
      },

      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);

        this.notificationService.handleApiError(error);
      },
    });
  }

  openBlockAccountDialog(id: string): void {
    this.dialog.open(BlockAccountComponent, {
      data: { accountId: id },
    });
  }

  openUnblockAccountDialog(id: string): void {
    this.dialog.open(UnblockAccountComponent, {
      data: { accountId: id },
    });
  }
}
