import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatSort } from '@angular/material/sort';
import { SupplierCategory } from '../../../models/category.model';
import { NotificationService } from '../../../services/notification.service';
import { StatusService } from '../../../services/status.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { RequestPricingService } from '../../../services/request-pricing.service';
import { ListRequestPricingResponse, RequestPricing, RequestPricingResponse } from '../../../models/request-pricing.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PaginationResponse } from '../../../models/base.model';

@Component({
  selector: 'app-request-pricing-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MaterialModule,
    TablerIconsModule,
    CommonModule
  ],
  templateUrl: './request-pricing-management.component.html',
  styleUrl: './request-pricing-management.component.scss'
})
export class RequestPricingManagementComponent {
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<RequestPricing> =
  new MatTableDataSource<RequestPricing>();
  displayedColumns: string[] = ['name', 'email','phone','expiration','status', 'action'];
  statusPage: number = 0;
  listRequestPricing: RequestPricing[] = [];
  pageNumber: number = 1; // Trang hiện tại
  pageSize: number = 8; // Số item mỗi trang
  totalItemCount: number = 0; // Tổng số item
  pageCount: number = 0; // Tổng số trang
  isFirstPage: boolean = false; // Có phải trang đầu tiên không
  isLastPage: boolean = false; // Có phải trang cuối cùng không
  hasNextPage: boolean = false; // Có trang tiếp theo không
  hasPreviousPage: boolean = false; // Có trang trước đó không
  selectedRequestPricing: RequestPricing | null = null;

  constructor(
    private requestPricingService: RequestPricingService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dialog: MatDialog
  ){
  }

  ngOnInit(){
    setTimeout(() => {
      this.statusService.statusLoadingSpinnerSource.next(true);
    });
    this.getAllRequestPricing(this.pageNumber, this.pageSize);
  }

  getAllRequestPricing(pageNumber: number, pageSize: number){
    this.requestPricingService.getAllRequestPricingByAdmin(pageNumber, pageSize).subscribe({
      next: (response: ListRequestPricingResponse) => {
        const data = response.data as PaginationResponse<RequestPricing>;
        this.listRequestPricing = data.items;
        
        this.dataSource = new MatTableDataSource(this.listRequestPricing);
        this.dataSource.sort = this.sort;
        this.pageNumber = data.pageNumber;
        this.pageSize = data.pageSize;
        this.totalItemCount = data.totalItemCount;
        this.isFirstPage = data.isFirstPage; 
        this.isLastPage = data.isLastPage; 
        this.hasNextPage = data.hasNextPage; 
        this.hasPreviousPage = data.hasPreviousPage; 
        this.statusService.statusLoadingSpinnerSource.next(false);
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.showToastrHandleError(error);
      },
    });
  }

  btnGetRequestPricingById(statusPage: number, id: number){
    this.statusPage = statusPage;
    this.requestPricingService.getRequestPricingById(id).subscribe({
      next: (response: RequestPricingResponse) => {
        const data = response.data as RequestPricing; 
        this.selectedRequestPricing = data;
        console.log(this.selectedRequestPricing);
        this.statusService.statusLoadingSpinnerSource.next(false);
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.showToastrHandleError(error);
      },
    }
    );
  }


  btnBackToMainPage(){
    this.statusPage = 0
  }

}
