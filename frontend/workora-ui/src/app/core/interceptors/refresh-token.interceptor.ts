import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { AuthTokens } from '../../domain/models/auth.model';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

/**
 * Functional HTTP Interceptor intercepting 401 Unauthorized responses to perform automatic token refresh.
 */
export const refreshTokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Exclude authentication endpoints from token refresh cycle to prevent infinite loops
      const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/refresh-token');

      if (error.status === 401 && !isAuthEndpoint) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap((tokens: AuthTokens) => {
              isRefreshing = false;
              refreshTokenSubject.next(tokens.accessToken);

              // Replay original request with newly issued access token
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${tokens.accessToken}` }
              });
              return next(retryReq);
            }),
            catchError((refreshError: unknown) => {
              isRefreshing = false;
              authService.clearSessionAndRedirect();
              return throwError(() => refreshError);
            })
          );
        } else {
          // Wait until ongoing refresh completes and token subject emits new value
          return refreshTokenSubject.pipe(
            filter((token: string | null): token is string => token !== null),
            take(1),
            switchMap((newToken: string) => {
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next(retryReq);
            })
          );
        }
      }

      return throwError(() => error);
    })
  );
};
