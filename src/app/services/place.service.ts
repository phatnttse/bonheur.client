import { inject, Injectable } from '@angular/core';
import { EndpointBase } from './endpoint-base.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../environments/environment.dev';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PlaceService extends EndpointBase {
  private http = inject(HttpClient);

  getAutoCompletePlaces(input: string, location?: string): Observable<any> {
    const params = new HttpParams().set('input', input);

    if (location) {
      params.set('location', location);
    }

    return this.http
      .get(`${environment.apiUrl}/api/v1/place/autocomplete`, {
        params: params,
        headers: this.requestHeaders.headers,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () =>
            this.getAutoCompletePlaces(input, location)
          );
        })
      );
  }
}
