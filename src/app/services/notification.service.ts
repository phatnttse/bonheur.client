import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);
  private toastr = inject(ToastrService);

  showToastrSuccess(message: string, title?: string) {
    this.toastr.success(message, title ?? '', {
      progressBar: true,
    });
  }

  showToastrHandleError(error: HttpErrorResponse) {
    this.toastr.error(
      error.error.detail ??
        'The system is experiencing an error, please try again later',
      'Error',
      {
        progressBar: true,
      }
    );
  }

  showToastrInfo(message: string, title?: string) {
    this.toastr.info(message, title ?? '', {
      progressBar: true,
    });
  }

  showToastrWarning(message: string, title?: string) {
    this.toastr.warning(message, title ?? '', {
      progressBar: true,
    });
  }

  openSnackBarWelcome(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  openSnackBarBottom(message: string, action: string, duration?: number) {
    this.snackBar.open(message, action, {
      duration: duration ?? 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  openSnackBarTop(message: string, action: string, duration?: number) {
    this.snackBar.open(message, action, {
      duration: duration ?? 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
