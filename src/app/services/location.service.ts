import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private http = inject(HttpClient);
  constructor() {}

  getProvinces(): Observable<any> {
    return this.http.get(`/assets/provinces.json`);
  }

  geocodeAddress(address: string) {
    const apiKey = environment.mapTilerApiKey; // Thay bằng API key của bạn
    const url = `https://api.maptiler.com/geocoding/${address}.json?key=${apiKey}`;

    return this.http.get(url);
  }
}
