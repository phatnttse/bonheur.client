import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../../../services/signalR.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { Router, RouterModule } from '@angular/router';
import { RequestPricingStatus } from '../../../models/enums.model';
import { RequestPricingService } from '../../../services/request-pricing.service';
import {
  ListRequestPricingResponse,
  RequestPricing,
} from '../../../models/request-pricing.model';
import { HttpErrorResponse } from '@angular/common/http';
import { TimeAgoPipe } from '../../../pipes/timeago.pipe';
import { MessageService } from '../../../services/message.service';
import { MessageStatistics } from '../../../models/chat.model';
import { BaseResponse } from '../../../models/base.model';
import { TablerIconsModule } from 'angular-tabler-icons';
import { DataService } from '../../../services/data.service';
import { Supplier } from '../../../models/supplier.model';
import { MatDialog } from '@angular/material/dialog';
import { ExportToExcelDialogComponent } from '../../dialogs/supplier/export-to-excel-dialog/export-to-excel-dialog.component';

interface MessageTypeItems {
  title: string;
  count?: number;
}
interface RequestPricingStatusItems {
  status: string;
  count?: number;
  color?: string;
  title?: string;
}

@Component({
  selector: 'app-mailbox',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    RouterModule,
    TimeAgoPipe,
    TablerIconsModule,
  ],
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.scss'],
})
export class MailboxComponent implements OnInit {
  messageTypeItems: MessageTypeItems[] = [];
  requestPricingStatuses: RequestPricingStatusItems[] = [];
  requestPricingList: RequestPricing[] = [];
  messageStatistics: MessageStatistics | null = null;
  pageNumber: number = 1; // Trang hiện tại
  pageSize: number = 10; // Số item mỗi trang
  totalItemCount: number = 0; // Tổng số item
  pageCount: number = 0; // Tổng số trang
  isFirstPage: boolean = false; // Có phải trang đầu tiên không
  isLastPage: boolean = false; // Có phải trang cuối cùng không
  hasNextPage: boolean = false; // Có trang tiếp theo không
  hasPreviousPage: boolean = false; // Có trang trước đó không
  supplier: Supplier | null = null;

  constructor(
    private signalRService: SignalRService,
    private requestPricingService: RequestPricingService,
    private router: Router,
    private messageService: MessageService,
    private dataService: DataService,
    private dialog: MatDialog
  ) {
    this.getRequestPricingList();
  }

  ngOnInit(): void {
    this.getMessageStatistics();
    const messageTypeItems: MessageTypeItems[] = [
      {
        title: 'Hộp thư đến',
        count: 0,
      },
      {
        title: 'Chưa đọc',
        count: 0,
      },
      {
        title: 'Đã đọc',
        count: 0,
      },
    ];
    this.messageTypeItems = messageTypeItems;

    const requestPricingStatuses: RequestPricingStatusItems[] = [
      {
        status: RequestPricingStatus.PENDING,
        title: 'Chờ xử lý',
        count: 0,
        color: '#FFC107',
      },
      {
        status: RequestPricingStatus.RESPONDED,
        title: 'Đã phản hồi',
        count: 0,
        color: '#4CAF50',
      },
      {
        status: RequestPricingStatus.BOOKED,
        title: 'Đã đặt',
        count: 0,
        color: '#2196F3',
      },
      {
        status: RequestPricingStatus.DISCARDED,
        title: 'Đã hủy',
        count: 0,
        color: '#F44336',
      },
    ];
    this.requestPricingStatuses = requestPricingStatuses;

    this.dataService.supplierData$.subscribe((supplier: Supplier | null) => {
      this.supplier = supplier;
    });
  }

  getRequestPricingList(): void {
    this.requestPricingService
      .getRequestPricingListBySupplier(this.pageNumber, this.pageSize)
      .subscribe({
        next: (response: ListRequestPricingResponse) => {
          this.requestPricingList = response.data.items;
          this.pageNumber = response.data.pageNumber;
          this.pageSize = response.data.pageSize;
          this.totalItemCount = response.data.totalItemCount;
          this.pageCount = response.data.pageCount;
          this.isFirstPage = response.data.isFirstPage;
          this.isLastPage = response.data.isLastPage;
          this.hasNextPage = response.data.hasNextPage;
          this.hasPreviousPage = response.data.hasPreviousPage;
          this.requestPricingStatuses.forEach((status) => {
            status.count = this.requestPricingList.filter(
              (r) => r.status === status.status
            ).length;
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
  }

  onOpenChatWindow(requestPricing: RequestPricing): void {
    this.router.navigate(['/supplier/mailbox/reply'], {
      queryParams: { rqp: requestPricing.id },
    });
  }

  getMessageStatistics(): void {
    this.messageService.getSupplierMessageStatistics().subscribe({
      next: (response: BaseResponse<MessageStatistics>) => {
        this.messageStatistics = response.data;
        this.messageTypeItems[0].count = this.messageStatistics.totalMessages;
        this.messageTypeItems[1].count = this.messageStatistics.unreadMessages;
        this.messageTypeItems[2].count =
          this.messageStatistics.totalMessages -
          this.messageStatistics.unreadMessages;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }

  changePage(pageNumber: number): void {
    this.pageNumber = pageNumber;
    this.getRequestPricingList();
  }

  exportToExcel(): void {
    if (
      this.supplier?.subscriptionPackage == null &&
      this.supplier?.priorityEnd == null &&
      this.supplier?.priorityEnd! < new Date()
    ) {
      this.dialog.open(ExportToExcelDialogComponent, {
        width: '600px',
      });
      return;
    }
    this.requestPricingService.exportToExcel().subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'RequestPricing.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }
}
