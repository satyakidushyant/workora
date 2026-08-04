import { Injectable, inject, signal } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

/**
 * Service managing global application loading indicators and route transition overlays.
 * Enforces a smooth minimum visible display time (800ms) to prevent quick flickers.
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly router = inject(Router);

  /**
   * Signal indicating if a page route navigation transition is currently in progress.
   */
  readonly isRouteLoading = signal<boolean>(false);

  private startTime: number = 0;
  private readonly minDisplayDurationMs: number = 800; // Enforce minimum 800ms display time

  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.hide();
      }
    });
  }

  show(): void {
    this.startTime = Date.now();
    this.isRouteLoading.set(true);
  }

  hide(): void {
    const elapsed = Date.now() - this.startTime;
    const remaining = Math.max(0, this.minDisplayDurationMs - elapsed);
    setTimeout(() => {
      this.isRouteLoading.set(false);
    }, remaining);
  }
}

