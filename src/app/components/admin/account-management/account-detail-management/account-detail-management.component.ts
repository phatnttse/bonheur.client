import { Component } from '@angular/core';
import { Account, AccountResponse } from '../../../../models/account.model';
import { NotificationService } from '../../../../services/notification.service';
import { AccountService } from '../../../../services/account.service';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusService } from '../../../../services/status.service';
import { MaterialModule } from '../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-account-detail-management',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule],
  templateUrl: './account-detail-management.component.html',
  styleUrl: './account-detail-management.component.scss'
})
export class AccountDetailManagementComponent {
    account: Account | null = null;

    constructor(
      private notificationService: NotificationService,
      private accountService: AccountService,
      private statusService: StatusService
    ){

    }

    ngOnInit(){

    }

    getAccount(id: string){
      this.accountService.getAccount(id).subscribe({
        next: (response: AccountResponse) => {
          const data = response.data as Account;
          this.account = data;
        }, 
        error: (error: HttpErrorResponse) => {
          this.statusService.statusLoadingSpinnerSource.next(false);
          // this.notificationService.showToastrHandleError(error);
        },
      })
    }
}
