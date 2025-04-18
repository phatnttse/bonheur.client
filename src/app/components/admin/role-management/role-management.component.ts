import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../material.module';
import {
  ListRoleResponse,
  Role,
  RoleResponse,
} from '../../../models/role.model';
import { AccountService } from '../../../services/account.service';
import { NotificationService } from '../../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusService } from '../../../services/status.service';
import { StatusCode } from '../../../models/enums.model';

import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../../services/data.service';
import { RoleDialogComponent } from '../../dialogs/admin/role-dialog/role-dialog.component';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, RouterModule],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.scss',
})
export class RoleManagementComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<Role> = new MatTableDataSource<Role>();
  displayedColumns: string[] = ['name', 'description', 'usersCount', 'action'];
  roles: Role[] = [];

  constructor(
    private accountService: AccountService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private dialogRef: MatDialog,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.statusService.statusLoadingSpinnerSource.next(true);
    });
    this.dataService.roleData$.subscribe((roles: Role[] | null) => {
      if (roles?.values) {
        this.roles = roles;
        this.dataSource = new MatTableDataSource(this.roles);
        this.dataSource.sort = this.sort;
      } else {
        this.getRoles();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getRoles() {
    this.accountService.getRoles().subscribe({
      next: (response: ListRoleResponse) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          if (Array.isArray(response.data)) {
            this.roles = response.data;
            this.dataSource = new MatTableDataSource(this.roles);
            this.dataSource.sort = this.sort;
            this.statusService.statusLoadingSpinnerSource.next(false);
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
        console.log(error);
      },
    });
  }

  openRoleDialog(id: string) {
    this.accountService.getRole(id).subscribe({
      next: (response: RoleResponse) => {
        this.dialogRef.open(RoleDialogComponent, {
          data: response.data,
          width: '600px',
        });
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
        console.log(error);
      },
    });
  }
}
