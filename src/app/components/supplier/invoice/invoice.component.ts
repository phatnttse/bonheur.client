import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { Invoice } from '../../../models/invoice.model';
import { VNDCurrencyPipe } from '../../../pipes/vnd-currency.pipe';
import { InvoiceService } from '../../../services/invoice.service';
import { BaseResponse, PaginationResponse } from '../../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [MaterialModule, CommonModule, VNDCurrencyPipe],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss',
})
export class InvoiceComponent implements OnInit {
  invoices: Invoice[] = [];

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.getInvoiceList();
  }

  getInvoiceList() {
    this.invoiceService.getInvoicesBySupplier().subscribe({
      next: (response: PaginationResponse<Invoice>) => {
        this.invoices = response.data.items;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  downloadInvoice(fileUrl: string) {
    if (!fileUrl) {
      console.error('File URL is missing.');
      return;
    }
    window.open(fileUrl, '_blank');
  }
}
