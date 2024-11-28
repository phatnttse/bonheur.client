import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  TitleStrategy,
  UrlSerializer,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppErrorHandler } from './app-error.handler';
import { AppTitleService } from './services/app-title.service';
import { LowerCaseUrlSerializer } from './services/lowercase-url-serializer.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withComponentInputBinding(),
      withPreloading(PreloadAllModules)
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: TitleStrategy, useClass: AppTitleService },
    { provide: UrlSerializer, useClass: LowerCaseUrlSerializer },
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      MaterialModule,
      TablerIconsModule.pick(TablerIcons),
      NgScrollbarModule
    ),
  ],
};
