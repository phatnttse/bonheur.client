import { inject, Injectable } from '@angular/core';
import { DBkeys } from './db-keys';
import { Utilities } from './utilities';
import { environment } from '../environments/environment.dev';
import { LocalStoreManager } from './localstorage-manager.service';
import { AppTranslationService } from './app-translation.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private localStorage = inject(LocalStoreManager);
  private translationService = inject(AppTranslationService);

  constructor() {
    this.loadLocalChanges();
  }

  set language(value: string | null) {
    this._language = value;
    this.saveToLocalStore(value, DBkeys.LANGUAGE);
    this.translationService.changeLanguage(value);
  }
  get language(): string {
    return this._language ?? ConfigurationService.defaultLanguage;
  }

  set homeUrl(value: string | null) {
    this._homeUrl = value;
    this.saveToLocalStore(value, DBkeys.HOME_URL);
  }
  get homeUrl(): string {
    return this._homeUrl ?? ConfigurationService.defaultHomeUrl;
  }

  // ***Specify default configurations here***
  public static readonly defaultLanguage = 'en';
  public static readonly defaultHomeUrl = '/';
  public static readonly defaultThemeId = 1;
  public baseUrl = environment.apiUrl ?? Utilities.baseUrl();
  private _language: string | null = null;
  private _homeUrl: string | null = null;

  private loadLocalChanges() {
    this._language = this.localStorage.getDataObject<string>(DBkeys.LANGUAGE);
    this.translationService.changeLanguage(this._language);
    this._homeUrl = this.localStorage.getDataObject<string>(DBkeys.HOME_URL);
  }
  private resetLanguage() {
    const language = this.translationService.useBrowserLanguage();

    if (language) {
      this._language = language;
    } else {
      this._language = this.translationService.useDefaultLanguage();
    }
  }
  private saveToLocalStore(data: unknown, key: string) {
    setTimeout(() => this.localStorage.setData(data, key));
  }

  public clearLocalChanges() {
    this._language = null;
    this._homeUrl = null;
    this.localStorage.deleteData(DBkeys.LANGUAGE);
    this.localStorage.deleteData(DBkeys.HOME_URL);
    this.resetLanguage();
  }
}
