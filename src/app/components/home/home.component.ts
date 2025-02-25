import { Component, OnInit, Output } from '@angular/core';
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
export class HomeComponent implements OnInit {
  @Output() supplierList: Supplier[] = [];
  isFeatured = true;

  constructor(
    private supplierService: SupplierService,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getSuppliers();
  }

  getSuppliers() {
    const getSupplierParams: GetSuppliersParams = {
      isFeatured: this.isFeatured,
      averageRating: 4.5,
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
