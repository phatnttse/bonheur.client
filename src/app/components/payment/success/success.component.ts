import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { PaymentLinkInformation } from '../../../models/payment.model';
import { Order } from '../../../models/order.model';
import { VNDCurrencyPipe } from '../../../pipes/vnd-currency.pipe';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [MaterialModule, CommonModule, RouterModule, VNDCurrencyPipe],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss',
})
export class SuccessComponent {
  @Input() orderInfo: Order | null = null;

  constructor() {}
}
