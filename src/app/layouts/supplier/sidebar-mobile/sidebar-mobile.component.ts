import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Supplier } from '../../../models/supplier.model';
import { Account } from '../../../models/account.model';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

interface SidebarItem {
  icon: string;
  label: string;
  route: string | null;
  subItems?: SidebarItem[];
}

@Component({
  selector: 'app-sidebar-mobile',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './sidebar-mobile.component.html',
  styleUrl: './sidebar-mobile.component.scss',
})
export class SidebarMobileComponent {
  @Input() isMenuOpen: boolean = false;
  @Input() account: Account | null = null;
  @Input() supplier: Supplier | null = null;
  @Output() logoutEvent = new EventEmitter<void>();
  @Output() toggleMenuEvent = new EventEmitter<void>();
  openDropdownIndex: number | null = null;
  sidebarItems: SidebarItem[] = [
    { icon: 'business', label: 'Home', route: '/supplier' },
    {
      icon: 'storefront',
      label: 'Storefront',
      route: null,
      subItems: [
        {
          label: 'Business details',
          icon: 'businessDetails',
          route: '/supplier/storefront/business-details',
        },
        {
          label: 'Location and map',
          icon: 'map',
          route: '/supplier/storefront/location-and-map',
        },
        {
          label: 'Photos',
          icon: 'camera',
          route: '/supplier/storefront/photos',
        },
        {
          label: 'Deals',
          icon: 'coupon',
          route: '/supplier/storefront/deals',
        },
        {
          label: 'FAQs',
          icon: 'faq',
          route: '/supplier/storefront/faqs',
        },
        {
          label: 'Social networks',
          icon: 'socialNetwork',
          route: '/supplier/storefront/social-networks',
        },
      ],
    },
    { icon: 'email', label: 'Enquiries', route: '/supplier/mailbox' },
    { icon: 'review', label: 'Reviews', route: '/supplier/reviews' },
    { icon: 'invoice', label: 'Invoices', route: '/supplier/invoices' },
    { icon: 'setting', label: 'Settings', route: '/supplier/settings' },
  ];

  constructor(private router: Router) {}

  toggleMenu() {
    this.toggleMenuEvent.emit();
  }

  closeMenu(event: MouseEvent) {
    event.stopPropagation();
    this.toggleMenu();
  }

  toggleDropdown(index: number) {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }

  navigateTo(route: string) {
    this.toggleMenu();
    this.router.navigate([route]);
  }

  isActive(route: string | null): boolean {
    return route ? this.router.url === route : false;
  }

  isParentActive(parent: SidebarItem): boolean {
    if (!parent.subItems) return false;
    return parent.subItems.some((subItem) => this.isActive(subItem.route));
  }

  onLogout() {
    this.logoutEvent.emit();
  }
}
