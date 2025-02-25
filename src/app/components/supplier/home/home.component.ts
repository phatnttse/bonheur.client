import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Supplier } from '../../../models/supplier.model';
import { DataService } from '../../../services/data.service';
import { RequestPricingService } from '../../../services/request-pricing.service';
import {
  ListRequestPricingResponse,
  RequestPricing,
} from '../../../models/request-pricing.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Order } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';
import { OnBoardStatus, SupplierStatus } from '../../../models/enums.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  supplier: Supplier | null = null;
  requestPricingList: RequestPricing[] = [];
  pageNumber: number = 1; // Trang hiện tại
  pageSize: number = 9999; // Số item mỗi trang
  orders: Order[] = [];
  statuses = SupplierStatus;
  onboardStatus = OnBoardStatus;

  constructor(
    private dataService: DataService,
    private requestPricingService: RequestPricingService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.dataService.supplierData$.subscribe((data: Supplier | null) => {
      if (data) {
        this.supplier = data;
      }
    });

    this.dataService.requestPricingBySupplierDataSource.subscribe(
      (data: RequestPricing[] | null) => {
        if (data) {
          this.requestPricingList = data;
        } else {
          this.getRequestPricingList();
        }
      }
    );
  }

  getRequestPricingList(): void {
    this.requestPricingService
      .getRequestPricingListBySupplier(this.pageNumber, this.pageSize)
      .subscribe({
        next: (response: ListRequestPricingResponse) => {
          this.requestPricingList = response.data.items;
          this.dataService.requestPricingBySupplierDataSource.next(
            response.data.items
          );
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
  }

  getOrdersBySupplier(): void {}
}
