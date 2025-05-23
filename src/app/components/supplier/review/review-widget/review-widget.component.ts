import { Component } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ListReviewResponse, Review } from '../../../../models/review.model';
import { NotificationService } from '../../../../services/notification.service';
import { StatusService } from '../../../../services/status.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from '../../../../services/data.service';
import { ReviewService } from '../../../../services/review.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-review-widget',
  standalone: true,
  imports: [MaterialModule, CommonModule, TablerIconsModule],
  templateUrl: './review-widget.component.html',
  styleUrl: './review-widget.component.scss',
})
export class ReviewWidgetComponent {
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
    if (this.supplierId !== null) {
      this.getReviews(this.supplierId, this.pageNumber, this.pageSize);
    }
  }

  getReviews(supplierId: number, pageNumber: number, pageSize: number) {
    this.reviewService.getReviews(supplierId, pageNumber, pageSize).subscribe({
      next: (response: ListReviewResponse) => {
        this.responseData = response;
        this.listReviewResponse = response.data.reviews.items;
        this.pageNumber = response.data.reviews.pageNumber;
        this.pageSize = response.data.reviews.pageSize;
        this.totalItemCount = response.data.reviews.totalItemCount;
        this.isFirstPage = response.data.reviews.isFirstPage;
        this.isLastPage = response.data.reviews.isLastPage;
        this.hasNextPage = response.data.reviews.hasNextPage;
        this.hasPreviousPage = response.data.reviews.hasPreviousPage;
        this.dataService;
        this.statusService.statusLoadingSpinnerSource.next(false);
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
      },
    });
  }
}
