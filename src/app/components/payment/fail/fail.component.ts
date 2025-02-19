import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { PaymentLinkInformation } from '../../../models/payment.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-fail',
  standalone: true,
  imports: [MaterialModule, CommonModule, RouterModule],
  templateUrl: './fail.component.html',
  styleUrl: './fail.component.scss',
})
export class FailComponent {
  @Input() paymentLinkInfo: PaymentLinkInformation | null = null;

  constructor() {}
}
