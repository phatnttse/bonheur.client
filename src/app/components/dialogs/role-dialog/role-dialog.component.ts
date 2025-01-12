import { Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { Account, AccountResponse } from '../../../models/account.model';
import { AccountService } from '../../../services/account.service';
import { NotificationService } from '../../../services/notification.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequestPricingDialogComponent } from '../request-pricing-dialog/request-pricing-dialog.component';
import { Role, RoleResponse } from '../../../models/role.model';
import { StatusService } from '../../../services/status.service';
import { Permission } from '../../../models/permission.model';
import { BaseResponse } from '../../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    CommonModule,
    MatCheckboxModule,
    FormsModule,
  ],
  templateUrl: './role-dialog.component.html',
  styleUrl: './role-dialog.component.scss',
})
export class RoleDialogComponent {
  roleForm: FormGroup;
  permissions: Permission[] = [];
  permissionsGrouped: { [key: string]: Permission[] } = {};
  role: Role | null = null;

  constructor(
    private roleService: AccountService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RequestPricingDialogComponent>,
    private statusService: StatusService,
    @Inject(MAT_DIALOG_DATA) public data: Role
  ) {
    if (data) {
      this.roleForm = this.fb.group({
        name: [
          data.name,
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
          ],
        ],
        description: [
          data.description,
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
          ],
        ],
        usersCount: ['', [Validators.required]],
        permissions: this.fb.group({}),
      });
    } else {
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
            Validators.minLength(6),
            Validators.maxLength(100),
          ],
        ],
      });
    }
    this.getAllPermissions();
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

  getAllPermissions() {
    // Gọi API để lấy danh sách tất cả các quyền
    this.roleService.getAllPermissions().subscribe({
      next: (response: BaseResponse<Permission[]>) => {
        const allPermissions = response.data; // Danh sách tất cả các quyền

        // Gọi API lấy thông tin role và danh sách quyền của role
        this.roleService.getRole(this.data.id).subscribe({
          next: (roleResponse: RoleResponse) => {
            const rolePermissions = roleResponse.data.permissions; // Danh sách quyền của role

            // Nhóm các quyền theo nhóm cha (groupName)
            this.permissionsGrouped = allPermissions.reduce(
              (groups: { [key: string]: Permission[] }, permission) => {
                if (!groups[permission.groupName]) {
                  groups[permission.groupName] = [];
                }
                groups[permission.groupName].push(permission);
                return groups;
              },
              {}
            );

            // Tạo checkbox và đặt trạng thái dựa trên quyền của role
            const permissionsFormGroup = this.roleForm.get(
              'permissions'
            ) as FormGroup;

            allPermissions.forEach((permission) => {
              const isChecked = rolePermissions.some(
                (rolePermission) => rolePermission.value === permission.value
              );

              permissionsFormGroup.addControl(
                permission.value,
                new FormControl(isChecked) // Trạng thái checkbox (true/false)
              );
            });
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error fetching role permissions', error);
          },
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching all permissions', error);
      },
    });
  }
}
