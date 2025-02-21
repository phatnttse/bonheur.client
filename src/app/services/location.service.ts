import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../environments/environment.dev';
import { EndpointBase } from './endpoint-base.service';

@Injectable({
  providedIn: 'root',
})
export class LocationService extends EndpointBase {
  private http = inject(HttpClient);

  getProvinces(): Observable<any> {
    return this.http.get(`/assets/provinces.json`);
  }

  geocodeAddress(address: string) {
    const apiKey = environment.mapTilerApiKey; // Thay bằng API key của bạn
    const url = `https://api.maptiler.com/geocoding/${address}.json?key=${apiKey}`;

    return this.http.get(url);
  }

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
