import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { ApiResponseDto } from '../../data/dtos/api-response.dto';

/**
 * Functional HTTP Interceptor providing centralized error handling for failed API requests.
 */
export const globalErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 response handling is delegated to RefreshTokenInterceptor
      if (error.status === 401) {
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
          fieldDetails = apiResponse.errors.map(err => `${err.field}: ${err.message}`);
        }
      } else if (error.status === 403) {
        errorMessage = 'Access denied. You do not possess the required permissions.';
      } else if (error.status === 404) {
        errorMessage = 'The requested resource was not found on the server.';
      } else if (error.status === 500) {
        errorMessage = 'Internal server error occurred. Please try again later.';
      }

      notificationService.showError(errorMessage, fieldDetails.length > 0 ? fieldDetails : undefined);
      return throwError(() => error);
    })
  );
};
