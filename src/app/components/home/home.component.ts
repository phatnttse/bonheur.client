import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from '../../material.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FeaturedSuppliersComponent } from './featured-suppliers/featured-suppliers.component';
import { GetSuppliersParams, Supplier } from '../../models/supplier.model';
import { SupplierService } from '../../services/supplier.service';
import { DataService } from '../../services/data.service';
import { StatusCode } from '../../models/enums.model';
import { PaginationResponse } from '../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CountUp } from 'countup.js';
import { Meta, Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { AdvertisementsDialogComponent } from '../dialogs/user/advertisements-dialog/advertisements-dialog.component';
import { AdvertisementService } from '../../services/advertisement.service';
import { Advertisement } from '../../models/advertisement.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TablerIconsModule,
    RouterModule,
    MaterialModule,
    SlickCarouselModule,
    FeaturedSuppliersComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, AfterViewInit {
  @Output() supplierList: Supplier[] = [];
  isFeatured = true;
  @ViewChild('countSection', { static: false }) countSection!: ElementRef;
  hasAnimated = false; // Để tránh chạy lại nhiều lần

  constructor(
    private supplierService: SupplierService,
    private router: Router,
    private dataService: DataService,
    private title: Title,
    private meta: Meta,
    private dialog: MatDialog
  ) {
    this.title.setTitle('Bonheur - Nền tảng dịch vụ cưới hỏi chuyên nghiệp');

    this.meta.addTags([
      {
        name: 'description',
        content:
          'Bonheur - Nền tảng giúp bạn tìm kiếm, xem hồ sơ nhà cung cấp dịch vụ cưới, xem vị trí trên bản đồ, yêu cầu báo giá và trò chuyện trực tiếp với nhà cung cấp.',
      },
      {
        name: 'keywords',
        content:
          'dịch vụ cưới, tổ chức tiệc cưới, wedding planner, nhà cung cấp dịch vụ cưới, báo giá cưới hỏi, Bonheur, wedding service, wedding vendor, wedding quotation, wedding planner, wedding, bonheur wedding, bonheur pro, bonheur wedding pro',
      },
      {
        property: 'og:title',
        content: 'Bonheur - Dịch vụ cưới hỏi chuyên nghiệp',
      },
      {
        property: 'og:description',
        content:
          'Tìm kiếm nhà cung cấp dịch vụ cưới, xem vị trí, yêu cầu báo giá và trò chuyện với nhà cung cấp trên nền tảng Bonheur.',
      },
      {
        property: 'og:image',
        content: 'https://bonheur.pro/assets/images/backgrounds/hero.png',
      },
      { property: 'og:url', content: 'https://bonheur.pro/' },
    ]);
  }

  ngOnInit(): void {
    this.getSuppliers();
  }

  ngAfterViewInit() {
    this.observeScroll();
  }

  observeScroll() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            this.startCounting('count1', 200);
            this.startCounting('count2', 1000);
            this.startCounting('count3', 1000);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (this.countSection) {
      observer.observe(this.countSection.nativeElement);
    }
  }

  startCounting(id: string, endValue: number) {
    const options = { duration: 5, separator: ',', prefix: '+' };
    const countUp = new CountUp(id, endValue, options);
    if (!countUp.error) {
      countUp.start();
    } else {
      console.error(countUp.error);
    }
  }

  getSuppliers() {
    const getSupplierParams: GetSuppliersParams = {
      isFeatured: this.isFeatured,
    };
    this.supplierService.getSuppliers(getSupplierParams).subscribe({
      next: (response: PaginationResponse<Supplier>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          this.supplierList = response.data.items;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }
}
