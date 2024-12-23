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
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, CommonModule, FormsModule],
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
  search: string = '';
  searchSubject = new Subject<string>();
  role: string = '';
  pageNumber: number = 1;
  pageSize: number = 10;
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
    // Lắng nghe thay đổi search và gọi API sau debounceTime
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((search) => {
        this.getAccounts(search, this.role, this.pageNumber, this.pageSize);
      });
    this.accountService.accountData$.subscribe((accounts) => {
      if (accounts) {
        this.accounts = accounts;
        this.dataSource = new MatTableDataSource(this.accounts);
      }
    });
    this.getAccounts(this.search, this.role, this.pageNumber, this.pageSize);
    console.log(this.search);
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
          this.statusService.statusLoadingSpinnerSource.next(false);
        },
        error: (error: HttpErrorResponse) => {
          this.statusService.statusLoadingSpinnerSource.next(false);
          this.notificationService.handleApiError(error);
        },
      });
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.search = input.value;
    this.searchSubject.next(this.search);
  }

  btnGetAccount(id: string) {
    this.route.navigate(['/admin/accounts/management', id]);
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
