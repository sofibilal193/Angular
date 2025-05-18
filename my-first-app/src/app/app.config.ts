import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthService } from './Services/Auth/auth.service';

export function initAppFactory(authService: AuthService): () => void {
  return () => authService.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: initAppFactory,
      deps: [AuthService],
      multi: true,
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      ToastrModule.forRoot({
        positionClass: 'toast-top-right',
        timeOut: 3000,
      })
    ),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          allowedDomains: ['localhost:4200'],
          disallowedRoutes: ['https://localhost:5092/api/Account/login'],
        },
      })
    ),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  ],
};
