import { Routes } from '@angular/router';

export const supplierRoutes: Routes = [
  {
    path: 'supplier',
    loadComponent() {
      return import('./../../layouts/supplier/supplier.component').then(
        (m) => m.SupplierComponent
      );
    },
    children: [
      {
        path: '',
        loadComponent() {
          return import('./home/home.component').then((m) => m.HomeComponent);
        },
      },
      {
        path: 'onboarding',
        loadComponent() {
          return import('./onboarding/onboarding.component').then(
            (m) => m.OnboardingComponent
          );
        },
      },
      {
        path: 'onboarding/step-1',
        loadComponent() {
          return import('./step-1/step-1.component').then(
            (m) => m.Step1Component
          );
        },
      },
      {
        path: 'onboarding/step-2',
        loadComponent() {
          return import('./step-2/step-2.component').then(
            (m) => m.Step2Component
          );
        },
      },
      {
        path: 'onboarding/step-3',
        loadComponent() {
          return import('./step-3/step-3.component').then(
            (m) => m.Step3Component
          );
        },
      },
      {
        path: 'storefront',
        loadComponent() {
          return import('./storefront/storefront.component').then(
            (m) => m.StorefrontComponent
          );
        },
        children: [
          { path: '', redirectTo: 'business-details', pathMatch: 'full' },
          {
            path: 'business-details',
            loadComponent() {
              return import(
                './storefront/business-detail/business-detail.component'
              ).then((m) => m.BusinessDetailComponent);
            },
          },
          {
            path: 'location-and-map',
            loadComponent() {
              return import(
                './storefront/location-and-map/location-and-map.component'
              ).then((m) => m.LocationAndMapComponent);
            },
          },
          {
            path: 'photos',
            loadComponent() {
              return import('./storefront/photos/photos.component').then(
                (m) => m.PhotosComponent
              );
            },
          },
          {
            path: 'deals',
            loadComponent() {
              return import('./storefront/deals/deals.component').then(
                (m) => m.DealsComponent
              );
            },
          },
          {
            path: 'faqs',
            loadComponent() {
              return import('./storefront/faqs/faqs.component').then(
                (m) => m.FaqsComponent
              );
            },
          },
          {
            path: 'social-networks',
            loadComponent() {
              return import(
                './storefront/social-networks/social-networks.component'
              ).then((m) => m.SocialNetworksComponent);
            },
          },
        ],
      },
    ],
  },
];
