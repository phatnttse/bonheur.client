import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
  },
  {
    path: '',
    component: BlankComponent,
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
      {
        path: 'pages/404',
        loadComponent() {
          return import('./pages/page-not-found/page-not-found.component').then(
            (m) => m.PageNotFoundComponent
          );
        },
      },
      { path: '**', redirectTo: 'pages/404' },
    ],
  },
];
