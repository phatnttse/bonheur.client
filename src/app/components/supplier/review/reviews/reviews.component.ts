import { Component } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ListReviewResponse, Review } from '../../../../models/review.model';
import { ReviewService } from '../../../../services/review.service';
import { NotificationService } from '../../../../services/notification.service';
import { StatusService } from '../../../../services/status.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from '../../../../services/data.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [MaterialModule, CommonModule, TablerIconsModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss',
})
export class ReviewsComponent {
  // supplierId: number | null = null;
  supplierId: number = 2;
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
  averageRate: number = 0;

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
        debugger;
        this.responseData = response;
        // this.listReviewResponse = response.data.reviews.data.items;
        // this.pageNumber = response.data.reviews.data.pageNumber;
        // this.pageSize = response.data.reviews.data.pageSize;
        // this.totalItemCount = response.data.reviews.data.totalItemCount;
        // this.isFirstPage = response.data.reviews.data.isFirstPage;
        // this.isLastPage = response.data.reviews.data.isLastPage;
        // this.hasNextPage = response.data.reviews.data.hasNextPage;
        // this.hasPreviousPage = response.data.reviews.data.hasPreviousPage;
        debugger;
        const scores = response.data.averageScores;

        this.averageRate = this.calculateAverage(scores);
        this.statusService.statusLoadingSpinnerSource.next(false);
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
      },
    });
  }

  calculateAverage(obj: Record<string, any>): number {
    const values = Object.values(obj).filter(
      (value) => typeof value === 'number' && !isNaN(value)
    );

    if (values.length === 0) return 0.0;

    return values.reduce((sum, num) => sum + num, 0) / values.length;
  }
}
