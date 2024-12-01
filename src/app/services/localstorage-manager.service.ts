import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Utilities } from './utilities';

@Injectable({
  providedIn: 'root',
})
/**
 * Provides a wrapper for accessing the web storage API and synchronizing session storage across tabs/windows.
 */
export class LocalStoreManager {
  public setData(data: unknown, key: string) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  public getData(key: string) {
    const item = localStorage.getItem(key);

    if (item === null) return null;

    return Utilities.JsonTryParse(item);
  }

  public deleteData(key: string) {
    localStorage.removeItem(key);
  }

  public getDataObject<T>(key: string, isDateType = false): T | null {
    let data = this.getData(key);

    if (data != null) {
      if (isDateType) {
        data = new Date(data);
      }
      return data as T;
    } else {
      return null;
    }
  }
}
