import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { environment } from '../../../environments/environment';

/**
 * Functional HTTP Interceptor appending Authorization Bearer headers to outgoing API requests.
 */
export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getAccessToken();

  // Check if target URL belongs to Workora API base domain
  const isApiUrl = req.url.includes(environment.apiUrl) || req.url.startsWith('/api/');

  if (token && isApiUrl) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
