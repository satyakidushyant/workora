import { Injectable, signal } from '@angular/core';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  details?: string[];
  duration?: number;
}

/**
 * High-level notification service managing real-time floating toast notifications across the application.
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  /**
   * Signal exposing active toast notifications.
   */
  readonly toasts = signal<ToastItem[]>([]);

  /**
   * Displays a success toast notification message.
   *
   * @param message Text message to display.
   * @param duration Optional duration in milliseconds (default 4000ms).
   */
  showSuccess(message: string, duration = 4000): void {
    this.addToast('success', message, undefined, duration);
  }

  /**
   * Displays an error toast notification message with optional field-level validation messages.
   *
   * @param message Main error header or summary.
   * @param details List of specific validation error messages.
   * @param duration Optional duration in milliseconds (default 5000ms).
   */
  showError(message: string, details?: string[], duration = 5000): void {
    this.addToast('error', message, details, duration);
  }

  /**
   * Displays a warning toast notification message.
   *
   * @param message Warning detail text.
   * @param duration Optional duration in milliseconds (default 4500ms).
   */
  showWarning(message: string, duration = 4500): void {
    this.addToast('warning', message, undefined, duration);
  }

  /**
   * Displays an informational toast notification message.
   *
   * @param message Info text.
   * @param duration Optional duration in milliseconds (default 4000ms).
   */
  showInfo(message: string, duration = 4000): void {
    this.addToast('info', message, undefined, duration);
  }

  /**
   * Dismisses a toast item by ID.
   *
   * @param id Unique toast identifier.
   */
  removeToast(id: string): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }

  private addToast(type: 'success' | 'error' | 'warning' | 'info', message: string, details?: string[], duration = 4000): void {
    if (!message || message.trim() === '') {
      return;
    }

    // Deduplicate: If an identical active toast already exists, ignore or refresh
    const existing = this.toasts().find(t => t.message === message && t.type === type);
    if (existing) {
      return;
    }

    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const toast: ToastItem = { id, type, message, details, duration };

    // Limit maximum active toasts to 3 so screen is never overwhelmed
    this.toasts.update(current => [toast, ...current].slice(0, 3));

    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    }
  }
}
