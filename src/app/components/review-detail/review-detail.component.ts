import { type } from 'jquery';
import { ChangeDetectorRef, Component, Input, NgZone } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ReviewService } from '../../services/review.service';
import { LocalStorageManager } from '../../services/localstorage-manager.service';
import { ActivatedRoute } from '@angular/router';
import { SupplierService } from '../../services/supplier.service';
import { StatusService } from '../../services/status.service';
import { NotificationService } from '../../services/notification.service';
import { ReviewCreation } from '../../models/review.model';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Supplier } from '../../models/supplier.model';
import { BaseResponse } from '../../models/base.model';
import { StatusCode } from '../../models/enums.model';
@Component({
  selector: 'app-review-detail',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    TablerIconsModule,
    FontAwesomeModule,
    FormsModule,
  ],
  templateUrl: './review-detail.component.html',
  styleUrl: './review-detail.component.scss',
})
export class ReviewDetailComponent {
  faStar = faStar;
  statusPage: number = 0;
  userId: number | null = null;
  summaryExperience: string = '';
  content: string = '';
  @Input() readonly: boolean = false;
  supplier: Supplier | null = null;

  ratings: { [key: string]: number } = {
    quality: 0,
    responsiveness: 0,
    professionalism: 0,
    value: 0,
    flexibility: 0,
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private reviewService: ReviewService,
    private localStorage: LocalStorageManager,
    private route: ActivatedRoute,
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private statusService: StatusService
  ) {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) this.getSupplierBySlug(slug);
    });
  }

  setRating(value: number, type: string) {
    if (this.readonly) return;

    this.ratings[type] = value;
    this.cdr.detectChanges(); // Cập nhật UI ngay lập tức
    console.log(this.ratings[type]);
  }

  getSupplierBySlug(slug: string): void {
    this.supplierService.getSupplierBySlug(slug).subscribe({
      next: (response: BaseResponse<Supplier>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          this.supplier = response.data;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }

  updateStatusPage(direction: 'back' | 'next'): void {
    if (direction === 'back') {
      this.statusPage--; // Bấm Back: trừ 1
    } else if (direction === 'next') {
      this.statusPage++; // Bấm Next: cộng 1
    }
  }

  onSubmitReview() {
    this.submitReview(
      0, // supplierId sẽ được cập nhật từ route param
      this.summaryExperience,
      this.content,
      this.ratings['quality'],
      this.ratings['responsiveness'],
      this.ratings['professionalism'],
      this.ratings['value'],
      this.ratings['flexibility']
    );
  }

  submitReview(
    supplierId: number,
    summaryExperience: string,
    content: string,
    quality: number,
    responsiveness: number,
    professionalism: number,
    value: number,
    flexibility: number
  ) {
    const user = this.localStorage.getDataObject<{ id: string }>(
      'current_user'
    );

    if (!user || !user.id) {
      console.error('User ID not found in local storage.');
      return;
    }

    const review = {
      userId: user.id,
      supplierId: this.supplier?.id ?? 0,
      summaryExperience,
      content,
      qualityOfService: quality,
      responseTime: responsiveness,
      professionalism,
      valueForMoney: value,
      flexibility,
    };

    this.reviewService.createReview(review).subscribe({
      next: (response: ReviewCreation) => {
        this.notificationService.success('Success', response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error('Error', error.error);
      },
    });
  }
}
