import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../environments/environment.dev';
import { EndpointBase } from './endpoint-base.service';
import { BaseResponse } from '../models/base.model';
import { MessageStatistics } from '../models/chat.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService extends EndpointBase {
  private http = inject(HttpClient);

  getSupplierMessageStatistics(): Observable<BaseResponse<MessageStatistics>> {
    return this.http
      .get<BaseResponse<MessageStatistics>>(
        `${environment.apiUrl}/api/v1/messages/supplier/statistics`,
        { headers: this.requestHeaders.headers }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.getSupplierMessageStatistics()
          );
        })
      );
  }

  getUnreadMessagesCountByUser(): Observable<BaseResponse<number>> {
    return this.http
      .get<BaseResponse<number>>(
        `${environment.apiUrl}/api/v1/messages/user/unread/count`,
        { headers: this.requestHeaders.headers }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.getUnreadMessagesCountByUser()
          );
        })
      );
  }
}
