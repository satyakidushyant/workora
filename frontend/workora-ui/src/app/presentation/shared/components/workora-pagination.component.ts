import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable Enterprise Workora Pagination Component.
 * Supports page size change, item range count, and keyboard/accessible page navigation.
 */
@Component({
  selector: 'app-workora-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#DCEBE7] bg-[#FAFCFB] text-xs">
      
      <!-- Left: Item Range Info -->
      <div class="text-[#6B7F7C] font-medium">
        Showing <span class="font-bold text-[#063B39]">{{ startItem }}</span> to 
        <span class="font-bold text-[#063B39]">{{ endItem }}</span> of 
        <span class="font-bold text-[#063B39]">{{ totalCount }}</span> results
      </div>

      <!-- Right: Page Controls -->
      <div class="flex items-center gap-1.5">
        <!-- Previous Page Button -->
        <button
          type="button"
          (click)="onPageChange(pageNumber - 1)"
          [disabled]="pageNumber <= 1"
          class="workora-btn-icon !w-8 !h-8 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous Page"
        >
          <span class="material-symbols-outlined text-base">chevron_left</span>
        </button>

        <!-- Current Page Indicator -->
        <div class="px-3 py-1 bg-white border border-[#DCEBE7] rounded-lg text-xs font-bold text-[#0E6E68] shadow-xs">
          Page {{ pageNumber }} of {{ totalPages || 1 }}
        </div>

        <!-- Next Page Button -->
        <button
          type="button"
          (click)="onPageChange(pageNumber + 1)"
          [disabled]="pageNumber >= totalPages"
          class="workora-btn-icon !w-8 !h-8 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next Page"
        >
          <span class="material-symbols-outlined text-base">chevron_right</span>
        </button>
      </div>

    </div>
  `
})
export class WorkoraPaginationComponent {
  @Input() pageNumber = 1;
  @Input() pageSize = 10;
  @Input() totalCount = 0;
  @Input() totalPages = 1;

  @Output() pageChange = new EventEmitter<number>();

  get startItem(): number {
    if (this.totalCount === 0) return 0;
    return (this.pageNumber - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalCount);
  }

  onPageChange(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages && newPage !== this.pageNumber) {
      this.pageChange.emit(newPage);
    }
  }
}
