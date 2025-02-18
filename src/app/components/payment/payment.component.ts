import { Component, OnInit, Output } from '@angular/core';
import { SuccessComponent } from './success/success.component';
import { FailComponent } from './fail/fail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusService } from '../../services/status.service';
import { PaymentStatus } from '../../models/enums.model';
import { PaymentLinkInformation } from '../../models/payment.model';
import { PaymentService } from '../../services/payment.service';
import { BaseResponse } from '../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [SuccessComponent, FailComponent, MaterialModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit {
  success: boolean | null = null;
  @Output() paymentLinkInfo: PaymentLinkInformation | null = null;
  @Output() orderInfo: Order | null = null;

  constructor(
    private route: ActivatedRoute,
    private statusService: StatusService,
    private paymentService: PaymentService,
    private notificationService: NotificationService,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (
        params['id'] &&
        params['status'] &&
        params['orderCode'] &&
        params['cancel']
      ) {
        setTimeout(() => {
          this.statusService.statusLoadingSpinnerSource.next(true);
        }, 200);
        this.handlePaymentCallback();
      }
    });
  }

  handlePaymentCallback(): void {
    const status = this.route.snapshot.queryParams['status'];
    const orderCode = this.route.snapshot.queryParams['orderCode'];
    const cancel = this.route.snapshot.queryParams['cancel'];

    if (status === PaymentStatus.PAID && cancel === 'false') {
      this.getOrderInfo(orderCode);
    } else {
      this.getPaymentLinkInfo(orderCode);
    }
  }

  getOrderInfo(orderCode: number): void {
    this.orderService.getOrderByCode(orderCode).subscribe({
      next: (response: BaseResponse<Order>) => {
        this.orderInfo = response.data;
        setTimeout(() => {
          this.statusService.statusLoadingSpinnerSource.next(false);
        }, 200);
        this.success = true;
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.router.navigate(['/supplier']);
        this.notificationService.handleApiError(error);
      },
    });
  }

  getPaymentLinkInfo(orderCode: number): void {
    this.paymentService.getPaymentRequestInfo(orderCode).subscribe({
      next: (response: BaseResponse<PaymentLinkInformation>) => {
        this.paymentLinkInfo = response.data;
        setTimeout(() => {
          this.statusService.statusLoadingSpinnerSource.next(false);
        }, 200);
        this.success = false;
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.router.navigate(['/supplier']);
        this.notificationService.handleApiError(error);
      },
    });
  }
}
