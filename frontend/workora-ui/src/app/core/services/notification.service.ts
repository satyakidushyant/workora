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
   */
  showSuccess(message: string, duration = 4000): void {
    this.addToast('success', message, undefined, duration);
  }

  success(message: string, duration = 4000): void {
    this.showSuccess(message, duration);
  }

  /**
   * Displays an error toast notification message with optional field-level validation messages.
   */
  showError(message: string, details?: string[], duration = 5000): void {
    this.addToast('error', message, details, duration);
  }

  error(message: string, details?: string[], duration = 5000): void {
    this.showError(message, details, duration);
  }

  /**
   * Displays a warning toast notification message.
   */
  showWarning(message: string, duration = 4500): void {
    this.addToast('warning', message, undefined, duration);
  }

  warning(message: string, duration = 4500): void {
    this.showWarning(message, duration);
  }

  /**
   * Displays an informational toast notification message.
   */
  showInfo(message: string, duration = 4000): void {
    this.addToast('info', message, undefined, duration);
  }

  info(message: string, duration = 4000): void {
    this.showInfo(message, duration);
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
