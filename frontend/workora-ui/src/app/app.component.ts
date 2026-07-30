import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './presentation/shared/components/toast-container.component';
import { LogoLoaderComponent } from './presentation/shared/components/logo-loader.component';
import { LoadingService } from './core/services/loading.service';

/**
 * Root Application Component with global Toast Notification container and route loading overlay.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastContainerComponent, LogoLoaderComponent],
  template: `
    <app-toast-container></app-toast-container>

    <!-- Global Route Transition Overlay with Workora Logo Loader -->
    <div
      *ngIf="loadingService.isRouteLoading()"
      class="fixed inset-0 z-[9990] bg-slate-950/80 backdrop-blur-md flex items-center justify-center transition-all duration-300">
      <app-logo-loader size="lg" label="Navigating Workspace..." sublabel="Workora HRMS"></app-logo-loader>
    </div>

    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  readonly loadingService = inject(LoadingService);
  title = 'workora-ui';
}
