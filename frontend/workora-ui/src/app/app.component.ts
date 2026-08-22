import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './presentation/shared/components/toast-container.component';

/**
 * Root Application Component with global Toast Notification container.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastContainerComponent],
  template: `
    <app-toast-container></app-toast-container>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'workora-ui';
}
