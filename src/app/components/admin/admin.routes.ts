import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    loadComponent() {
      return import('./../../layouts/full/full.component').then(
        (m) => m.FullComponent
      );
    },
    children: [
      {
        path: 'roles/management',
        loadComponent() {
          return import('./role-management/role-management.component').then(
            (m) => m.RoleManagementComponent
          );
        },
      },
      {
        path: 'categories/management',
        loadComponent() {
          return import('./category-management/category-management.component').then(
            (m) => m.CategoryManagementComponent
          );
        },
      },
      {
        path: 'request-pricing/management',
        loadComponent() {
          return import('./request-pricing-management/request-pricing-management.component').then(
            (m) => m.RequestPricingManagementComponent
          );
        },
      },
      {
        path: 'accounts/management',
        loadComponent() {
          return import('./account-management/account-management.component').then(
            (m) => m.AccountManagementComponent
          );
        },
      },
      {
        path: 'account/:id',
        loadComponent() {
          return import('./account-management/account-detail-management/account-detail-management.component').then(
            (m) => m.AccountDetailManagementComponent
          );
        },
      },
    ],
  },
];
