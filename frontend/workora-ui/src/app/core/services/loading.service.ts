import { Injectable, inject, signal } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

/**
 * Service managing global application loading indicators and route transition overlays.
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

  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isRouteLoading.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        // Small delay to ensure smooth transition
        setTimeout(() => {
          this.isRouteLoading.set(false);
        }, 200);
      }
    });
  }

  show(): void {
    this.isRouteLoading.set(true);
  }

  hide(): void {
    this.isRouteLoading.set(false);
  }
}
