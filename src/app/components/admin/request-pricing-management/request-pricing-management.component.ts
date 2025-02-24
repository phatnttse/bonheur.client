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
import {
  ListRequestPricingResponse,
  RequestPricing,
  RequestPricingResponse,
} from '../../../models/request-pricing.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PaginationResponse } from '../../../models/base.model';
import { Router } from '@angular/router';
import { RequestPricingDialogComponent } from '../../dialogs/admin/request-pricing-dialog/request-pricing-dialog.component';
import { catchError, map, Observable, throwError } from 'rxjs';
import { DataService } from '../../../services/data.service';

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
    CommonModule,
  ],
  templateUrl: './request-pricing-management.component.html',
  styleUrl: './request-pricing-management.component.scss',
})
export class RequestPricingManagementComponent {
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<RequestPricing> =
    new MatTableDataSource<RequestPricing>();
  displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    'expiration',
    'status',
    'action',
  ];
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
    private route: Router,
    private dialog: MatDialog,
    private dataService: DataService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.statusService.statusLoadingSpinnerSource.next(true);
    });
    this.dataService.requestPricingData$.subscribe(
      (requestPricings: RequestPricing[] | null) => {
        if (requestPricings?.values) {
          (this.listRequestPricing = requestPricings),
            (this.dataSource = new MatTableDataSource(this.listRequestPricing));
          this.dataSource.sort = this.sort;
        } else {
          this.getAllRequestPricing(this.pageNumber, this.pageSize);
        }
      }
    );
  }

  getAllRequestPricing(pageNumber: number, pageSize: number) {
    this.requestPricingService
      .getAllRequestPricingByAdmin(pageNumber, pageSize)
      .subscribe({
        next: (response: ListRequestPricingResponse) => {
          this.listRequestPricing = response.data.items;

          this.dataSource = new MatTableDataSource(this.listRequestPricing);
          this.dataSource.sort = this.sort;
          this.pageNumber = response.data.pageNumber;
          this.pageSize = response.data.pageSize;
          this.totalItemCount = response.data.totalItemCount;
          this.isFirstPage = response.data.isFirstPage;
          this.isLastPage = response.data.isLastPage;
          this.hasNextPage = response.data.hasNextPage;
          this.hasPreviousPage = response.data.hasPreviousPage;
          this.statusService.statusLoadingSpinnerSource.next(false);
        },
        error: (error: HttpErrorResponse) => {
          this.statusService.statusLoadingSpinnerSource.next(false);
          this.notificationService.handleApiError(error);
        },
      });
  }

  getRequestPricingById(id: number): Observable<RequestPricing> {
    this.statusService.statusLoadingSpinnerSource.next(true);

    return this.requestPricingService.getRequestPricingById(id).pipe(
      map((response: RequestPricingResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        return response.data;
      }),
      catchError((error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
        return throwError(() => error);
      })
    );
  }

  btnGetRequestPricingById(id: number) {
    this.requestPricingService.getRequestPricingById(id).subscribe({
      next: (response: RequestPricingResponse) => {
        this.selectedRequestPricing = response.data;
        this.statusService.statusLoadingSpinnerSource.next(false);
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
      },
    });
  }

  openDialogRequestPricing(id?: number) {
    let selectedRequestPricing;

    if (id) {
      selectedRequestPricing = this.listRequestPricing.find(
        (sp) => sp.id === id
      );
    } else {
      selectedRequestPricing = {};
    }

    const dialogRef = this.dialog.open(RequestPricingDialogComponent, {
      data: selectedRequestPricing,
    });

    dialogRef.afterClosed().subscribe((result: RequestPricing) => {
      if (result) {
        const index = this.listRequestPricing.findIndex(
          (item) => item.id === result.id
        );
        if (index !== -1) {
          this.listRequestPricing[index] = result;
        } else {
          this.listRequestPricing.push(result);
        }

        this.dataService.requestPricingDataSource.next(this.listRequestPricing);
      }
    });
  }
}
