import { Injectable } from '@angular/core';

/**
 * Interface representing structured notification messages.
 */
export interface NotificationPayload {
  /**
   * Notification type classification.
   */
  type: 'success' | 'error' | 'warning' | 'info';

  /**
   * Human-readable message text.
   */
  message: string;

  /**
   * Optional field-level error detail strings.
   */
  details?: string[];
}

/**
 * Service facilitating global user notifications and error snackbars/toasts.
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  /**
   * Displays a success toast notification message.
   *
   * @param message Text message to display.
   */
  showSuccess(message: string): void {
    console.log(`[Notification Success] ${message}`);
  }

  /**
   * Displays an error toast notification message with optional field-level validation messages.
   *
   * @param message Main error header or summary.
   * @param details List of specific validation error messages.
   */
  showError(message: string, details?: string[]): void {
    console.error(`[Notification Error] ${message}`, details || []);
  }

  /**
   * Displays a warning toast notification message.
   *
   * @param message Warning detail text.
   */
  showWarning(message: string): void {
    console.warn(`[Notification Warning] ${message}`);
  }

  /**
   * Displays an informational toast notification message.
   *
   * @param message Info text.
   */
  showInfo(message: string): void {
    console.info(`[Notification Info] ${message}`);
  }
}
