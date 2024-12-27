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
      {
        path: 'confirm-email',
        loadComponent() {
          return import(
            './components/confirm-email/confirm-email.component'
          ).then((m) => m.ConfirmEmailComponent);
        },
      },
    ],
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
