import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { ApiResponseDto } from '../../data/dtos/api-response.dto';

/**
 * Centralized HTTP Error Interceptor.
 * Captures all API failure responses and extracts backend-provided messages
 * and validation field details, displaying them cleanly in global toaster notifications.
 */
export const globalErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/refresh-token');

      // 401 on non-auth requests will be handled by RefreshTokenInterceptor
      if (error.status === 401 && !isAuthEndpoint) {
        return throwError(() => error);
      }

      let errorMessage = 'An unexpected error occurred while communicating with the server.';
      let fieldDetails: string[] = [];

      if (error.error && typeof error.error === 'object') {
        const apiResponse = error.error as ApiResponseDto<unknown>;

        if (apiResponse.message) {
          errorMessage = apiResponse.message;
        }

        if (apiResponse.errors && Array.isArray(apiResponse.errors)) {
          fieldDetails = apiResponse.errors.map(err => {
            if (typeof err === 'string') return err;
            if (err?.field && err?.message) return `${err.field}: ${err.message}`;
            return err?.message || String(err);
          });
        }
      } else if (typeof error.error === 'string' && error.error.trim().length > 0) {
        errorMessage = error.error;
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to the Workora server. Please check your network connection or verify the backend is running.';
      } else if (error.status === 400) {
        errorMessage = 'Invalid request. Please verify the submitted data.';
      } else if (error.status === 401) {
        errorMessage = 'Invalid email or password. Please verify your credentials.';
      } else if (error.status === 403) {
        errorMessage = 'Access denied. You do not possess the required permissions.';
      } else if (error.status === 404) {
        errorMessage = 'The requested resource was not found on the server.';
      } else if (error.status === 500) {
        errorMessage = 'Internal server error occurred. Please try again later.';
      }

      // Display the exact backend error in toaster notification
      notificationService.showError(errorMessage, fieldDetails.length > 0 ? fieldDetails : undefined);
      return throwError(() => error);
    })
  );
};
