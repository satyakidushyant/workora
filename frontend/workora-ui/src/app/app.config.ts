import { ApplicationConfig, provideZoneChangeDetection, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { routes } from './app.routes';
import { AUTH_REPOSITORY } from './domain/repositories/i-auth.repository';
import { AuthApiRepository } from './data/repositories/auth-api.repository';
import { USER_REPOSITORY } from './domain/repositories/i-user.repository';
import { UserApiRepository } from './data/repositories/user-api.repository';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { refreshTokenInterceptor } from './core/interceptors/refresh-token.interceptor';
import { globalErrorInterceptor } from './core/interceptors/global-error.interceptor';
import { AuthService } from './core/services/auth.service';
import { TokenService } from './core/services/token.service';

/**
 * Global Angular application configuration setting up HTTP interceptors, repository bindings, and app initialization.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        jwtInterceptor,
        refreshTokenInterceptor,
        globalErrorInterceptor
      ])
    ),
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthApiRepository
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserApiRepository
    },
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      const tokenService = inject(TokenService);
      if (tokenService.hasAccessToken()) {
        return authService.loadProfile().pipe(
          catchError(() => {
            authService.clearSessionAndRedirect();
            return of(null);
          })
        );
      }
      return of(null);
    })
  ]
};

