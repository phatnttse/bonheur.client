import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ListReviewResponse, Review } from '../../../models/review.model';
import { ReviewService } from '../../../services/review.service';
import { NotificationService } from '../../../services/notification.service';
import { StatusService } from '../../../services/status.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [MaterialModule, CommonModule, TablerIconsModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
})
export class ReviewComponent {
  supplierId: number | null = null;
  responseData: ListReviewResponse | null = null;
  listReviewResponse: Review[] = [];
  pageNumber: number = 1; // Trang hiện tại
  pageSize: number = 8; // Số item mỗi trang
  totalItemCount: number = 0; // Tổng số item
  pageCount: number = 0; // Tổng số trang
  isFirstPage: boolean = false; // Có phải trang đầu tiên không
  isLastPage: boolean = false; // Có phải trang cuối cùng không
  hasNextPage: boolean = false; // Có trang tiếp theo không
  hasPreviousPage: boolean = false; // Có trang trước đó không
  averageRate: number = 0.0;

  /**
   *
   */
  constructor(
    private reviewService: ReviewService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private route: Router,
    private dataService: DataService
  ) {}

  ngOnInit() {
    // setTimeout(() => {
    //   this.statusService.statusLoadingSpinnerSource.next(true);
    // });
    if (this.supplierId !== null) {
      this.getReviews(this.supplierId, this.pageNumber, this.pageSize);
    }
  }

  getReviews(supplierId: number, pageNumber: number, pageSize: number) {
    this.reviewService.getReviews(supplierId, pageNumber, pageSize).subscribe({
      next: (response: ListReviewResponse) => {
        this.responseData = response;
        this.listReviewResponse = response.data.reviews.data.items;
        this.pageNumber = response.data.reviews.data.pageNumber;
        this.pageSize = response.data.reviews.data.pageSize;
        this.totalItemCount = response.data.reviews.data.totalItemCount;
        this.isFirstPage = response.data.reviews.data.isFirstPage;
        this.isLastPage = response.data.reviews.data.isLastPage;
        this.hasNextPage = response.data.reviews.data.hasNextPage;
        this.hasPreviousPage = response.data.reviews.data.hasPreviousPage;
        const scores = response.data.averageScores;
        this.averageRate =
          (scores.averageFlexibility +
            scores.averageProfessionalism +
            scores.averageQualityOfService +
            scores.averageResponseTime +
            scores.averageValueOfMoney) /
          5;
        this.statusService.statusLoadingSpinnerSource.next(false);
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
      },
    });
  }
}
