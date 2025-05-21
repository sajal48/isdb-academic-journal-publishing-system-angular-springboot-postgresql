import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideLoadingBarRouter } from '@ngx-loading-bar/router';
import { provideLoadingBarInterceptor } from '@ngx-loading-bar/http-client';
import { authInterceptorUserInterceptor } from './site-settings/auth/auth-interceptor-user.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi(), 
      withInterceptors([authInterceptorUserInterceptor])
    ),
    provideLoadingBarInterceptor(),
    provideLoadingBarRouter()
  ]
};
