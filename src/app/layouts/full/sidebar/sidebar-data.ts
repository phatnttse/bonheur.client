import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
    bgcolor: 'primary',
    route: '/admin/dashboard',
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
  {
    displayName: 'Social Networks',
    iconName: 'brand-meta',
    bgcolor: 'accent',
    route: '/admin/social-networks/management',
  },
  {
    displayName: 'Ad Package',
    iconName: 'ad-2',
    bgcolor: 'warning',
    route: '/admin/ad-package/management',
  },
  {
    displayName: 'Blog Management',
    iconName: 'article',
    bgcolor: 'primary',
    route: '/admin/blog/management',
  },
];
