import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { Toast } from '../models/toast.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);
  private toastr = inject(ToastrService);
  private toastrs: Toast[] =[];
  private toastSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastSubject.asObservable();
  show(title: string, message: string, type: 'success' | 'error' | 'info' | 'warning'){
    const id= Date.now();
    const toastr: Toast ={ id, title, message, type};
    this.toastrs.push(toastr);
    this.toastSubject.next(this.toastrs);
    setTimeout(() => this.remove(id), 3000);
    return id;
  }

  remove(id: number){
    this.toastrs = this.toastrs.filter(t => t.id !== id);
    this.toastSubject.next(this.toastrs);
  }

  success(title: string, message: string): number{
    return this.show(title, message, 'success');
  }

  error(title: string, message: string): number{
    return this.show(title, message, 'error' );
  };

  info(title: string, message: string): number{
    return this.show(title, message, 'info' );
  };
  
  warning(title: string, message: string): number{
    return this.show(title, message, 'warning' );
  };

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
