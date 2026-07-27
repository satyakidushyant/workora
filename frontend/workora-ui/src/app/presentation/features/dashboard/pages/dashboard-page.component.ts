import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

/**
 * Smart Container Component for Dashboard page.
 */
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-4">Workora Dashboard</h1>
      @if (currentUser(); as user) {
        <div class="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-xl">
          <p><strong>Welcome,</strong> {{ user.firstName }} {{ user.lastName }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Roles:</strong> {{ user.roles.join(', ') }}</p>
          <button (click)="logout()" class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Sign Out
          </button>
        </div>
      }
    </div>
  `
})
export class DashboardPageComponent {
  private readonly authService: AuthService = inject(AuthService) as AuthService;

  readonly currentUser = this.authService.currentUser;

  /**
   * Triggers user logout sequence.
   */
  logout(): void {
    this.authService.logout().subscribe();
  }
}
