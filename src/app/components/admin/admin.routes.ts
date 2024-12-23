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
        path: 'roles/management/:id',
        loadComponent() {
          return import(
            './role-management/role-details-management/role-details-management.component'
          ).then((m) => m.RoleDetailsManagementComponent);
        },
      },
      {
        path: 'categories/management',
        loadComponent() {
          return import(
            './category-management/category-management.component'
          ).then((m) => m.CategoryManagementComponent);
        },
      },
      {
        path: 'categories/management/:id',
        loadComponent() {
          return import(
            './category-management/category-details-management/category-details-management.component'
          ).then((m) => m.CategoryDetailsManagementComponent);
        },
      },
      {
        path: 'categories/management/create',
        loadComponent() {
          return import(
            './category-management/category-create-management/category-create-management.component'
          ).then((m) => m.CategoryCreateManagementComponent);
        },
      },

      {
        path: 'request-pricing/management',
        loadComponent() {
          return import(
            './request-pricing-management/request-pricing-management.component'
          ).then((m) => m.RequestPricingManagementComponent);
        },
      },
      {
        path: 'accounts/management',
        loadComponent() {
          return import(
            './account-management/account-management.component'
          ).then((m) => m.AccountManagementComponent);
        },
      },
      {
        path: 'accounts/:id',
        loadComponent() {
          return import(
            './account-management/account-detail-management/account-detail-management.component'
          ).then((m) => m.AccountDetailManagementComponent);
        },
      },
    ],
  },
];
