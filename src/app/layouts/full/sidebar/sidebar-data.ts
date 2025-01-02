import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
    bgcolor: 'primary',
    route: '/dashboard',
  },
  {
    navCap: 'Ui Components',
  },
  {
    displayName: 'Role Management',
    iconName: 'shield-checkered',
    bgcolor: 'success',
    route: '/admin/roles/management',
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
    bgcolor: 'primary',
    route: '/admin/subscription-packages/management',
  },
  {
    navCap: 'Auth',
  },
  {
    displayName: 'Login',
    iconName: 'lock',
    bgcolor: 'accent',
    route: '/authentication/login',
  },
  {
    displayName: 'Register',
    iconName: 'user-plus',
    bgcolor: 'warning',
    route: '/authentication/register',
  },
  {
    navCap: 'Extra',
  },
  {
    displayName: 'Icons',
    iconName: 'mood-smile',
    bgcolor: 'success',
    route: '/extra/icons',
  },
];
