import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable Enterprise Workora Skeleton Loading State Component.
 * Supports table row skeletons, card skeletons, and custom line lists.
 */
@Component({
  selector: 'app-workora-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (type === 'table') {
      <div class="space-y-3 p-4">
        @for (i of countArray; track $index) {
          <div class="flex items-center gap-4 py-3 border-b border-[#DCEBE7]/50 last:border-none">
            <div class="w-9 h-9 rounded-full workora-skeleton shrink-0"></div>
            <div class="space-y-1.5 flex-1">
              <div class="h-3.5 w-1/4 workora-skeleton rounded-md"></div>
              <div class="h-2.5 w-1/3 workora-skeleton rounded-md"></div>
            </div>
            <div class="h-5 w-16 workora-skeleton rounded-full"></div>
            <div class="h-3.5 w-24 workora-skeleton rounded-md hidden sm:block"></div>
            <div class="h-8 w-16 workora-skeleton rounded-lg"></div>
          </div>
        }
      </div>
    } @else if (type === 'card') {
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        @for (i of countArray; track $index) {
          <div class="p-6 bg-white border border-[#DCEBE7] rounded-2xl space-y-3">
            <div class="flex justify-between items-center">
              <div class="w-10 h-10 rounded-xl workora-skeleton"></div>
              <div class="h-5 w-12 rounded-full workora-skeleton"></div>
            </div>
            <div class="h-3 w-1/2 workora-skeleton rounded-md"></div>
            <div class="h-7 w-2/3 workora-skeleton rounded-md"></div>
          </div>
        }
      </div>
    } @else {
      <div class="space-y-2.5">
        @for (i of countArray; track $index) {
          <div class="h-4 w-full workora-skeleton rounded-md"></div>
        }
      </div>
    }
  `
})
export class WorkoraSkeletonComponent {
  /**
   * Skeleton rendering type: 'table' | 'card' | 'line'.
   */
  @Input() type: 'table' | 'card' | 'line' = 'table';

  /**
   * Number of skeleton repeat units.
   */
  @Input() set count(value: number) {
    this.countArray = Array.from({ length: value });
  }

  countArray: number[] = [1, 2, 3, 4, 5];
}
