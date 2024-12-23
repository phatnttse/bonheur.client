import { Component } from '@angular/core';
import { AccountService } from '../../../../services/account.service';
import { NotificationService } from '../../../../services/notification.service';
import { StatusService } from '../../../../services/status.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Role, RoleResponse } from '../../../../models/role.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
  Permission,
  PermissionValues,
} from '../../../../models/permission.model';
import { BaseResponse } from '../../../../models/base.model';

@Component({
  selector: 'app-role-details-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    TablerIconsModule,
    FormsModule,
  ],
  templateUrl: './role-details-management.component.html',
  styleUrl: './role-details-management.component.scss',
})
export class RoleDetailsManagementComponent {
  dataSource: MatTableDataSource<Role> = new MatTableDataSource<Role>();
  role: Role | null = null;
  roleId: string | null = null;
  roleForm: FormGroup;
  permissions: Permission[] = [];
  permissionsGrouped: { [key: string]: Permission[] } = {};

  constructor(
    private accountService: AccountService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private fb: FormBuilder
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.roleId = params.get('id');
    });
    this.roleForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(200),
        ],
      ],
      usersCount: ['', [Validators.required]],
      permissions: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.statusService.statusLoadingSpinnerSource.next(true);
    });
    if (this.roleId) {
      this.getRole(this.roleId);
    }
    this.getAllPermissionValues();
  }

  getRole(id: string) {
    this.accountService.getRole(id).subscribe({
      next: (response: RoleResponse) => {
        const data = response.data as Role;
        this.role = data;
        this.roleForm.patchValue({
          name: this.role.name,
          description: this.role.description,
          usersCount: this.role.usersCount,
        });
        this.statusService.statusLoadingSpinnerSource.next(false);
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
        this.statusService.statusLoadingSpinnerSource.next(false);
      },
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.roleForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  isChecked(permissionValue: string) {
    return this.role?.permissions?.some(
      (rolePermission) => rolePermission.value === permissionValue
    );
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  getAllPermissionValues() {
    this.accountService.getAllPermissions().subscribe({
      next: (response: BaseResponse<Permission[]>) => {
        const data = response.data as Permission[];

        // Nhóm permissions theo groupName
        this.permissionsGrouped = data.reduce(
          (groups: { [key: string]: Permission[] }, permission) => {
            if (!groups[permission.groupName]) {
              groups[permission.groupName] = [];
            }
            groups[permission.groupName].push(permission);
            return groups;
          },
          {}
        );
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }
}
