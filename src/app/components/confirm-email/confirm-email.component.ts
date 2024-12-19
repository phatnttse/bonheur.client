import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BaseResponse } from '../../models/base.model';
import { StatusCode } from '../../models/enums.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { StatusService } from '../../services/status.service';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss',
})
export class ConfirmEmailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private statusService: StatusService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const token = params.get('token');
      const email = params.get('email');
      if (token && email) {
        setTimeout(() => {
          this.statusService.statusLoadingSpinnerSource.next(true);
        });
        this.confirmEmail(token, email);
      } else {
        this.router.navigate(['/pages/404']);
      }
    });
  }

  confirmEmail(token: string, email: string) {
    this.authService.confirmEmail(token, email).subscribe({
      next: (response: BaseResponse<null>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          this.statusService.statusLoadingSpinnerSource.next(false);
          this.router.navigate(['/signin']);
          this.notificationService.openSnackBarTop(
            response.message,
            'OK',
            5000
          );
        }
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
      },
    });
  }
}
