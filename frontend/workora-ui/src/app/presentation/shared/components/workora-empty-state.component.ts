import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable Enterprise Workora Empty State Component.
 * Displays a clean, branded empty slate with customizable icon, title, description, and optional action button.
 */
@Component({
  selector: 'app-workora-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="py-16 px-6 text-center flex flex-col items-center justify-center max-w-md mx-auto animate-in fade-in duration-300">
      <!-- Icon Container -->
      <div class="w-16 h-16 rounded-2xl bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center mb-4 shadow-xs border border-[#0E6E68]/15">
        <span class="material-symbols-outlined text-3xl">{{ icon }}</span>
      </div>

      <!-- Title -->
      <h3 class="text-base font-extrabold text-[#063B39] font-heading tracking-tight mb-1">
        {{ title }}
      </h3>

      <!-- Description -->
      <p class="text-xs text-[#6B7F7C] leading-relaxed mb-6">
        {{ description }}
      </p>

      <!-- Action Button -->
      @if (actionLabel) {
        <button 
          (click)="actionClicked.emit()" 
          class="workora-btn-primary text-xs px-5 py-2.5 shadow-teal"
        >
          @if (actionIcon) {
            <span class="material-symbols-outlined text-base">{{ actionIcon }}</span>
          }
          <span>{{ actionLabel }}</span>
        </button>
      }
    </div>
  `
})
export class WorkoraEmptyStateComponent {
  /**
   * Material symbol icon identifier.
   */
  @Input() icon = 'folder_open';

  /**
   * Main title header.
   */
  @Input() title = 'No data available';

  /**
   * Explanatory description.
   */
  @Input() description = 'There are no records matching your current filter criteria.';

  /**
   * Optional action button label.
   */
  @Input() actionLabel?: string;

  /**
   * Optional action button icon identifier.
   */
  @Input() actionIcon?: string;

  /**
   * Emitted when the action button is clicked.
   */
  @Output() actionClicked = new EventEmitter<void>();
}
