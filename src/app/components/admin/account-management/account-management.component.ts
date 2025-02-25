import { Component, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
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
import { HttpErrorResponse } from '@angular/common/http';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AccountDialogComponent } from '../../dialogs/admin/account-dialog/account-dialog.component';
import { BlockAccountComponent } from '../../dialogs/admin/block-account/block-account.component';
import { UnblockAccountComponent } from '../../dialogs/admin/unblock-account/unblock-account.component';

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
  role: string = '';
  seach: string = '';
  searchSubject: Subject<string> = new Subject<string>();

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
    // Lắng nghe thay đổi search và gọi API sau debounceTime
    if (this.searchSubject) {
      this.searchSubject
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((search) => {
          this.seach = search;
          this.getAccounts(search, this.role, this.pageNumber, this.pageSize);
        });
    } else {
      this.getAccounts(this.seach, this.role, this.pageNumber, this.pageSize);
    }
    this.getAccounts(this.seach, this.role, this.pageNumber, this.pageSize);
  }

  getAccounts(
    search: string,
    role: string,
    pageNumber: number,
    pageSize: number
  ) {
    this.accountService
      .getAccounts(search, role, pageNumber, pageSize)
      .subscribe({
        next: (response: ListAccountResponse) => {
          this.accounts = response.data.items;

          this.dataSource = new MatTableDataSource(this.accounts);
          this.dataSource.sort = this.sort;
          this.pageNumber = response.data.pageNumber;
          this.pageSize = response.data.pageSize;
          this.totalItemCount = response.data.totalItemCount;
          this.isFirstPage = response.data.isFirstPage;
          this.isLastPage = response.data.isLastPage;
          this.hasNextPage = response.data.hasNextPage;
          this.hasPreviousPage = response.data.hasPreviousPage;
        },
        error: (error: HttpErrorResponse) => {
          this.notificationService.handleApiError(error);
        },
      });
  }

  openAccountDialog(id?: string): void {
    if (id) {
      this.accountService.getAccount(id).subscribe({
        next: (response: AccountResponse) => {
          this.dialog.open(AccountDialogComponent, {
            data: response.data,
          });
        },
        error: (error: HttpErrorResponse) => {
          this.notificationService.handleApiError(error);
        },
      });
    }
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

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const searchValue = input.value;
    this.searchSubject.next(searchValue);
  }
}
