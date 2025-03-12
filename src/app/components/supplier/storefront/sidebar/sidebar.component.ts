import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { DataService } from '../../../../services/data.service';
import { Supplier } from '../../../../models/supplier.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  title: string;
  icon: string;
  count?: number;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MaterialModule, CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  supplier: Supplier | null = null;
  photoCount: number = 0;
  menuItems: MenuItem[] = [];
  primaryImage: string = '';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.supplierData$.subscribe((supplier: Supplier | null) => {
      if (supplier != null) {
        this.supplier = supplier;
        this.photoCount = this.supplier!.images!.length;
        if (this.supplier.images) {
          this.supplier.images.forEach((image) => {
            if (image.isPrimary) {
              this.primaryImage = image.imageUrl ?? '';
            }
          });
        }
        const menuItems: MenuItem[] = [
          {
            title: 'Business details',
            icon: 'businessDetails.svg',
            route: '/supplier/storefront/business-details',
          },
          {
            title: 'Location and map',
            icon: 'map.svg',
            route: '/supplier/storefront/location-and-map',
          },
          {
            title: 'Photos',
            icon: 'camera.svg',
            count: this.photoCount,
            route: '/supplier/storefront/photos',
          },
          {
            title: 'Videos',
            icon: 'video2.svg',
            count: this.supplier.videos?.length,
            route: '/supplier/storefront/videos',
          },
          {
            title: 'Deals',
            icon: 'coupon.svg',
            route: '/supplier/storefront/deals',
          },
          {
            title: 'FAQs',
            icon: 'faq.svg',
            route: '/supplier/storefront/faqs',
          },
          {
            title: 'Social networks',
            icon: 'socialNetwork.svg',
            route: '/supplier/storefront/social-networks',
          },
        ];
        this.menuItems = menuItems;
      }
    });
  }
}
