import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from '../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';
import {
  RequestPricing,
  RequestPricingResponse,
} from '../../../../models/request-pricing.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestPricingService } from '../../../../services/request-pricing.service';
import { StatusService } from '../../../../services/status.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-request-pricing-detail-management',
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
  templateUrl: './request-pricing-detail-management.component.html',
  styleUrl: './request-pricing-detail-management.component.scss',
})
export class RequestPricingDetailManagementComponent {
  selectedRequestPricing: RequestPricing | null = null;
  selectedRequestPricingId: number | null = null;

  /**
   *
   */
  constructor(
    private route: ActivatedRoute,
    private requestPricingService: RequestPricingService,
    private statusService: StatusService,
    private notificationService: NotificationService,
    private navigateRoute: Router
  ) {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.selectedRequestPricingId = id !== null ? +id : null;
    });
  }

  ngOnInit() {
    if (this.selectedRequestPricingId) {
      this.getRequestPricing(this.selectedRequestPricingId);
    }
  }

  getRequestPricing(id: number) {
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

  // Thay đổi trạng thái của trang
  btnReturnListPage() {
    this.navigateRoute.navigate(['admin', 'request-pricing', 'management']);
  }
}
