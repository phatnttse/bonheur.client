import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { Supplier } from '../../../models/supplier.model';
import { SupplierService } from '../../../services/supplier.service';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { VNDCurrencyPipe } from '../../../pipes/vnd-currency.pipe';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-featured-suppliers',
  standalone: true,
  imports: [
    SlickCarouselModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    VNDCurrencyPipe,
    RouterModule,
    TablerIconsModule,
    CommonModule,
  ],
  templateUrl: './featured-suppliers.component.html',
  styleUrl: './featured-suppliers.component.scss',
})
export class FeaturedSuppliersComponent {
  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    infinite: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          arrow: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          arrow: true,
        },
      },
    ],
  };
  @Input() supplierList: Supplier[] = [];

  constructor() {}

  isSupplierPriorityExpired(supplier: Supplier): boolean {
    if (
      supplier.priorityEnd &&
      supplier.priorityEnd > new Date() &&
      supplier.subscriptionPackage !== null
    ) {
      return true;
    }
    return false;
  }
}
