import { Routes } from '@angular/router';
import { adminRoutes } from './components/admin/admin.routes';

export const routes: Routes = [
  {
    path: 'authentication',
    loadComponent() {
      return import('./layouts/blank/blank.component').then(
        (m) => m.BlankComponent
      );
    },
    children: [
      {
        path: 'signin',
        loadComponent() {
          return import('./components/signin/signin.component').then(
            (m) => m.SigninComponent
          );
        },
      },
      {
        path: 'signin-google',
        loadComponent() {
          return import(
            './components/signin-google/signin-google.component'
          ).then((m) => m.SigninGoogleComponent);
        },
      },
      {
        path: 'signup',
        loadComponent() {
          return import('./components/signup/signup.component').then(
            (m) => m.SignupComponent
          );
        },
      },
    ],
  },
  {
    path: 'confirm-email',
    loadComponent() {
      return import('./components/confirm-email/confirm-email.component').then(
        (m) => m.ConfirmEmailComponent
      );
    },
  },
  {
    path: '',
    loadComponent() {
      return import('./layouts/user/user.component').then(
        (m) => m.UserComponent
      );
    },
    children: [
      {
        path: '',
        loadComponent() {
          return import('./components/home/home.component').then(
            (m) => m.HomeComponent
          );
        },
      },
      {
        path: 'suppliers',
        loadComponent() {
          return import('./components/suppliers/suppliers.component').then(
            (m) => m.SuppliersComponent
          );
        },
      },
      {
        path: 'suppliers/:slug',
        loadComponent() {
          return import(
            './components/supplier-detail/supplier-detail.component'
          ).then((m) => m.SupplierDetailComponent);
        },
      },
      {
        path: 'profile',
        loadComponent() {
          return import(
            './components/user-profile/user-profile.component'
          ).then((m) => m.UserProfileComponent);
        },
      },
    ],
  },
  {
    path: 'supplier/signup',
    loadComponent() {
      return import(
        './components/signup-supplier/signup-supplier.component'
      ).then((m) => m.SignupSupplierComponent);
    },
  },
  {
    path: 'supplier',
    loadComponent() {
      return import('./layouts/supplier/supplier.component').then(
        (m) => m.SupplierComponent
      );
    },
    children: [
      {
        path: 'onboarding',
        loadComponent() {
          return import(
            './components/supplier/onboarding/onboarding.component'
          ).then((m) => m.OnboardingComponent);
        },
      },
      {
        path: 'onboarding/step-1',
        loadComponent() {
          return import('./components/supplier/step-1/step-1.component').then(
            (m) => m.Step1Component
          );
        },
      },
      {
        path: 'onboarding/step-2',
        loadComponent() {
          return import('./components/supplier/step-2/step-2.component').then(
            (m) => m.Step2Component
          );
        },
      },
      {
        path: 'onboarding/step-3',
        loadComponent() {
          return import('./components/supplier/step-3/step-3.component').then(
            (m) => m.Step3Component
          );
        },
      },
    ],
  },
  {
    path: 'pages/404',
    loadComponent() {
      return import('./pages/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      );
    },
  },
  ...adminRoutes,
  { path: '**', redirectTo: 'pages/404' },
];
