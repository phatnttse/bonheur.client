import { BaseResponse } from './base.model';
import { Permission } from './permission.model';

export interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissions: Permission[];
}

export interface ListRoleResponse extends BaseResponse<Role[]> {}
export interface RoleResponse extends BaseResponse<Role> {}
