import { Routes } from '@angular/router';
import { adminRoutes } from './components/admin/admin.routes';
import { supplierRoutes } from './components/supplier/supplier.routes';
import { userGuard } from './guards/user.guard';
import { supplierGuard } from './guards/supplier.guard';

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
        path: 'about',
        loadComponent() {
          return import('./components/about/about.component').then(
            (m) => m.AboutComponent
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
        canActivate: [userGuard],
      },
      {
        path: 'favorite-supplier',
        loadComponent() {
          return import(
            './components/favorite-supplier/favorite-supplier.component'
          ).then((m) => m.FavoriteSupplierComponent);
        },
        canActivate: [userGuard],
      },
      {
        path: 'favorite-supplier/categories',
        loadComponent() {
          return import(
            './components/favorite-supplier/favorite-supplier-list-categories/favorite-supplier-list-categories.component'
          ).then((m) => m.FavoriteSupplierListCategoriesComponent);
        },
        canActivate: [userGuard],
      },
      {
        path: 'favorite-supplier/categories/:categoryId',
        loadComponent() {
          return import(
            './components/favorite-supplier/favorite-supplier-category/favorite-supplier-category.component'
          ).then((m) => m.FavoriteSupplierCategoryComponent);
        },
        canActivate: [userGuard],
      },
      {
        path: 'inbox',
        loadComponent() {
          return import('./components/chat/chat.component').then(
            (m) => m.ChatComponent
          );
        },
        canActivate: [userGuard],
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
    path: 'payment',
    loadComponent() {
      return import('./components/payment/payment.component').then(
        (m) => m.PaymentComponent
      );
    },
    canActivate: [supplierGuard],
  },
  {
    path: 'pages/404',
    loadComponent() {
      return import('./pages/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      );
    },
  },
  {
    path: 'review-detail/:slug',
    loadComponent() {
      return import('./components/review-detail/review-detail.component').then(
        (m) => m.ReviewDetailComponent
      );
    },
    canActivate: [userGuard],
  },
  ...supplierRoutes,
  ...adminRoutes,
  { path: '**', redirectTo: 'pages/404' },
];
