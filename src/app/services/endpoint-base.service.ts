import { inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, Subject, from, throwError } from 'rxjs';
import { mergeMap, switchMap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root',
})
export class EndpointBase {
  private authService = inject(AuthService);

  private taskPauser: Subject<boolean> | null = null;
  private isRefreshingLogin = false;

  protected get requestHeaders(): {
    headers: HttpHeaders | { [header: string]: string | string[] };
  } {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.accessToken}`,
      Accept: 'application/json, text/plain, */*',
    });

    return { headers };
  }

  public refreshLogin(): Observable<Account | null> {
    return this.authService.refreshLogin().pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error, () => this.refreshLogin());
      })
    );
  }

  protected handleError<T>(
    error: HttpErrorResponse,
    continuation: () => Observable<T>
  ): Observable<T> {
    console.error('handleError', error);
    if (error.status === 401) {
      if (this.isRefreshingLogin) {
        return this.pauseTask(continuation);
      }

      this.isRefreshingLogin = true;

      return from(this.authService.refreshLogin()).pipe(
        mergeMap(() => {
          this.isRefreshingLogin = false;
          this.resumeTasks(true);

          return continuation();
        }),
        catchError((refreshLoginError: HttpErrorResponse) => {
          this.isRefreshingLogin = false;
          this.resumeTasks(false);
          if (refreshLoginError.status === 401) {
            this.authService.logout();
            this.authService.reLogin();
            return throwError(() => new Error('session expired'));
          } else {
            return throwError(
              () => refreshLoginError || new Error('server error')
            );
          }
        })
      );
    }
    return throwError(() => error);
  }

  // pause task
  private pauseTask<T>(continuation: () => Observable<T>) {
    if (!this.taskPauser) {
      this.taskPauser = new Subject();
    }

    return this.taskPauser.pipe(
      switchMap((continueOp) => {
        return continueOp
          ? continuation()
          : throwError(() => new Error('session expired'));
      })
    );
  }

  // continue task
  private resumeTasks(continueOp: boolean) {
    setTimeout(() => {
      if (this.taskPauser) {
        this.taskPauser.next(continueOp);
        this.taskPauser.complete();
        this.taskPauser = null;
      }
    });
  }
}
