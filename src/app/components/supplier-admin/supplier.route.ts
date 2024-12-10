import { Routes } from '@angular/router';

export const supplierRoutes: Routes = [
    {
      path: 'supplier',
      loadComponent() {
        return import('./../../layouts/full/full.component').then(
          (m) => m.FullComponent
        );
      },
      children: [
        {
          path: 'request-pricing/management',
          loadComponent() {
            return import('./supplier/supplier-request-pricing-management/supplier-request-pricing-management.component').then(
              (m) => m.SupplierRequestPricingManagementComponent
            );
          },
        }
      ],
    },
  ];
  