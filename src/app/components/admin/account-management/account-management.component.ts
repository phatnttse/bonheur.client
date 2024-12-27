import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MaterialModule } from '../../../material.module';
import { MatSort } from '@angular/material/sort';
import {
  Account,
  AccountResponse,
  ListAccountResponse,
} from '../../../models/account.model';
import { AccountService } from '../../../services/account.service';
import { NotificationService } from '../../../services/notification.service';
import { StatusService } from '../../../services/status.service';
import { MatDialog } from '@angular/material/dialog';
import { PaginationResponse } from '../../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';
import { TablerIconsModule } from 'angular-tabler-icons';
import { BlockAccountComponent } from '../../dialogs/block-account/block-account.component';
import { UnblockAccountComponent } from '../../dialogs/unblock-account/unblock-account.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, CommonModule],
  templateUrl: './account-management.component.html',
  styleUrl: './account-management.component.scss',
})
export class AccountManagementComponent {
  @ViewChild(MatSort) sort!: MatSort;
  accounts: Account[] = [];
  dataSource: MatTableDataSource<Account> = new MatTableDataSource<Account>();
  displayedColumns: string[] = [
    'avatar',
    'fullName',
    'email',
    'phone',
    'gender',
    'role',
    'action',
  ];
  pageNumber: number = 1;
  pageSize: number = 8;
  totalItemCount: number = 0;
  pageCount: number = 0;
  isFirstPage: boolean = false;
  isLastPage: boolean = false;
  hasNextPage: boolean = false;
  hasPreviousPage: boolean = false;

  constructor(
    private accountService: AccountService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private dialog: MatDialog,
    private route: Router
  ) {
    // this.categoryForm = this.fb.group({
    //   name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    //   description: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(200)]],
    // });
  }

  ngOnInit() {
    setTimeout(() => {
      this.statusService.statusLoadingSpinnerSource.next(true);
    });
    this.accountService.accountData$.subscribe((accounts) => {
      if (accounts) {
        this.accounts = accounts;
        this.dataSource = new MatTableDataSource(this.accounts);
      }
    });
    // this.getAccounts(this.pageNumber, this.pageSize);
  }

  // getAccounts(pageNumber: number, pageSize: number){
  //   this.accountService.getAccounts(pageNumber, pageSize).subscribe({
  //     next: (response: ListAccountResponse) => {
  //       const data = response.data as PaginationResponse<Account>;
  //       this.accounts = data.items;

  //       this.dataSource = new MatTableDataSource(this.accounts);
  //       this.dataSource.sort = this.sort;
  //       this.pageNumber = data.pageNumber;
  //       this.pageSize = data.pageSize;
  //       this.totalItemCount = data.totalItemCount;
  //       this.isFirstPage = data.isFirstPage;
  //       this.isLastPage = data.isLastPage;
  //       this.hasNextPage = data.hasNextPage;
  //       this.hasPreviousPage = data.hasPreviousPage;
  //       this.statusService.statusLoadingSpinnerSource.next(false);
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       this.statusService.statusLoadingSpinnerSource.next(false);
  //       this.notificationService.handleApiError(error);
  //     },
  //   });
  // }

  btnGetAccount(id: string) {
    this.route.navigate(['/admin/account/', id]);
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
