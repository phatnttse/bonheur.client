import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
    bgcolor: 'primary',
    route: '/dashboard',
  },
  {
    displayName: 'Supplier Management',
    iconName: 'users',
    bgcolor: 'error',
    route: '/admin/suppliers/management',
  },
  {
    displayName: 'Category Management',
    iconName: 'poker-chip',
    bgcolor: 'warning',
    route: '/admin/categories/management',
  },
  {
    displayName: 'Quote Management',
    iconName: 'list',
    bgcolor: 'success',
    route: '/admin/request-pricing/management',
  },
  {
    displayName: 'Account Management',
    iconName: 'users',
    bgcolor: 'primary',
    route: '/admin/accounts/management',
  },
  {
    displayName: 'Subscription Packages',
    iconName: 'tooltip',
    bgcolor: 'warning',
    route: '/admin/subscription-packages/management',
  },
  {
    displayName: 'Role Management',
    iconName: 'shield-checkered',
    bgcolor: 'success',
    route: '/admin/roles/management',
  },
];
