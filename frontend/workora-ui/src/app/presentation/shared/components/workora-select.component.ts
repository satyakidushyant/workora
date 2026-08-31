import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  forwardRef, 
  signal, 
  computed, 
  HostListener, 
  ElementRef, 
  inject, 
  ChangeDetectionStrategy,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

export interface WorkoraSelectOption<T = any> {
  value: T;
  label: string;
  sublabel?: string;
  icon?: string;
  badge?: string;
  badgeClass?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-workora-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WorkoraSelectComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full select-none" [class.opacity-60]="disabled" [class.pointer-events-none]="disabled">
      
      <!-- Trigger Button -->
      <button
        #triggerBtn
        type="button"
        (click)="toggleOpen($event)"
        (keydown)="onKeyDown($event)"
        [disabled]="disabled"
        [ngClass]="{
          'bg-white border-[#087F73] ring-4 ring-[#087F73]/15 shadow-2xs': isOpen(),
          'bg-[#F6FAF9] border-[#DDE9E6] hover:border-[#087F73] hover:bg-[#F0FAF8]': !isOpen() && !hasError,
          'bg-red-50/50 border-red-300 ring-2 ring-red-200': hasError
        }"
        class="w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-2xl border text-xs font-semibold text-[#102A2A] transition-all cursor-pointer outline-none text-left min-h-[42px]">
        
        <div class="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
          @if (loading) {
            <span class="w-3.5 h-3.5 border-2 border-[#087F73] border-t-transparent rounded-full animate-spin shrink-0"></span>
          }
          
          @if (selectedOption(); as opt) {
            <div class="flex flex-col min-w-0 leading-tight">
              <span class="truncate font-semibold text-[#102A2A]">{{ opt.label }}</span>
              @if (opt.sublabel) {
                <span class="truncate text-[10px] text-[#718686] font-normal">{{ opt.sublabel }}</span>
              }
            </div>
          } @else {
            <span class="text-[#718686] font-normal truncate">{{ placeholder }}</span>
          }
        </div>

        <div class="flex items-center gap-1 shrink-0">
          @if (clearable && selectedValue !== null && selectedValue !== undefined && !disabled) {
            <span 
              (click)="onClear($event)"
              class="material-symbols-outlined text-sm text-slate-400 hover:text-rose-500 p-0.5 rounded-md transition-colors cursor-pointer"
              title="Clear selection">
              close
            </span>
          }
          <span 
            [ngClass]="isOpen() ? 'rotate-180 text-[#087F73]' : 'text-slate-400'"
            class="material-symbols-outlined text-lg transition-transform duration-200">
            expand_more
          </span>
        </div>
      </button>

      <!-- Dropdown Menu Panel -->
      @if (isOpen()) {
        <div 
          [ngClass]="openUpwards() ? 'bottom-full mb-1.5' : 'top-full mt-1.5'"
          class="absolute left-0 right-0 z-[9999] bg-white border border-[#DDE9E6] rounded-2xl shadow-xl p-1.5 flex flex-col animate-in fade-in zoom-in-95 duration-150"
          [class]="dropdownClass">
          
          <!-- Search Bar (Optional) -->
          @if (searchable) {
            <div class="p-1.5 border-b border-[#DDE9E6]/70 pb-2 mb-1">
              <div class="relative">
                <input
                  #searchInput
                  type="text"
                  [ngModel]="searchTerm()"
                  (ngModelChange)="onSearchChange($event)"
                  (click)="$event.stopPropagation()"
                  (keydown)="onSearchKeyDown($event)"
                  [placeholder]="searchPlaceholder"
                  class="w-full pl-8 pr-3 py-1.5 bg-[#F6FAF9] text-xs text-[#102A2A] rounded-xl border border-[#DDE9E6] focus:border-[#087F73] focus:bg-white outline-none font-medium transition-all"
                />
                <span class="material-symbols-outlined text-slate-400 absolute left-2 top-2 text-sm pointer-events-none">search</span>
              </div>
            </div>
          }

          <!-- Options List -->
          <div 
            #optionsContainer
            class="overflow-y-auto space-y-1 p-0.5 custom-scrollbar"
            [style.max-height]="maxHeight">
            
            @if (loading) {
              <div class="px-3 py-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <span class="w-3.5 h-3.5 border-2 border-[#087F73] border-t-transparent rounded-full animate-spin"></span>
                <span>Loading options...</span>
              </div>
            } @else if (filteredOptions().length === 0) {
              <div class="px-3 py-4 text-center text-xs text-slate-400 italic">
                {{ emptyText }}
              </div>
            } @else {
              @for (opt of filteredOptions(); track opt.value; let idx = $index) {
                <div
                  (click)="selectOption(opt, $event)"
                  [ngClass]="{
                    'bg-[#DDF7F2] text-[#075E58] font-bold': isSelected(opt.value),
                    'bg-[#F6FAF9] text-[#087F73]': idx === highlightedIndex() && !isSelected(opt.value),
                    'text-[#102A2A] hover:bg-[#F6FAF9] hover:text-[#087F73]': idx !== highlightedIndex() && !isSelected(opt.value),
                    'opacity-40 pointer-events-none': opt.disabled
                  }"
                  class="px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-between gap-2.5">
                  
                  <div class="flex items-center gap-2.5 min-w-0 flex-1">
                    <div class="flex flex-col min-w-0 leading-tight">
                      <span class="truncate">{{ opt.label }}</span>
                      @if (opt.sublabel) {
                        <span class="truncate text-[10px] text-slate-400 font-normal mt-0.5">{{ opt.sublabel }}</span>
                      }
                    </div>
                  </div>

                  <div class="flex items-center gap-1.5 shrink-0">
                    @if (opt.badge) {
                      <span 
                        [class]="opt.badgeClass || 'bg-slate-100 text-slate-600 border-slate-200'"
                        class="px-1.5 py-0.5 rounded-md text-[10px] font-bold border">
                        {{ opt.badge }}
                      </span>
                    }
                    @if (isSelected(opt.value)) {
                      <span class="material-symbols-outlined text-base text-[#087F73] font-bold">check</span>
                    }
                  </div>

                </div>
              }
            }

          </div>

        </div>
      }

    </div>
  `
})
export class WorkoraSelectComponent implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef);

  @ViewChild('triggerBtn') triggerBtn?: ElementRef<HTMLButtonElement>;
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;
  @ViewChild('optionsContainer') optionsContainer?: ElementRef<HTMLDivElement>;

  @Input() placeholder = 'Select an option';
  @Input() emptyText = 'No options available';
  @Input() searchable = false;
  @Input() searchPlaceholder = 'Search...';
  @Input() clearable = false;
  @Input() icon?: string;
  @Input() hasError = false;
  @Input() disabled = false;
  @Input() loading = false;
  @Input() placement: 'auto' | 'down' | 'up' = 'auto';
  @Input() dropdownClass = '';
  @Input() maxHeight = '240px';

  @Input() valueKey = 'value';
  @Input() labelKey = 'label';
  @Input() sublabelKey = 'sublabel';
  @Input() iconKey = 'icon';
  @Input() badgeKey = 'badge';

  @Input() set options(val: any[]) {
    this._rawOptions.set(val || []);
  }

  @Output() selectionChange = new EventEmitter<any>();

  private readonly _rawOptions = signal<any[]>([]);
  readonly normalizedOptions = computed<WorkoraSelectOption[]>(() => {
    const raw = this._rawOptions();
    if (!raw || raw.length === 0) return [];

    return raw.map(item => {
      if (item === null || item === undefined) {
        return { value: item, label: '' };
      }
      if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
        return { value: item, label: String(item) };
      }
      return {
        value: item[this.valueKey] !== undefined ? item[this.valueKey] : item,
        label: item[this.labelKey] !== undefined ? String(item[this.labelKey]) : String(item),
        sublabel: item[this.sublabelKey] ? String(item[this.sublabelKey]) : undefined,
        icon: item[this.iconKey] ? String(item[this.iconKey]) : undefined,
        badge: item[this.badgeKey] ? String(item[this.badgeKey]) : undefined,
        badgeClass: item['badgeClass'],
        disabled: !!item['disabled']
      };
    });
  });

  selectedValue: any = null;
  readonly isOpen = signal<boolean>(false);
  readonly openUpwards = signal<boolean>(false);
  readonly searchTerm = signal<string>('');
  readonly highlightedIndex = signal<number>(-1);

  readonly selectedOption = computed<WorkoraSelectOption | null>(() => {
    const val = this.selectedValue;
    if (val === null || val === undefined) return null;
    const opts = this.normalizedOptions();
    return opts.find(o => o.value === val || String(o.value) === String(val)) || null;
  });

  readonly filteredOptions = computed<WorkoraSelectOption[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const opts = this.normalizedOptions();
    if (!term) return opts;
    return opts.filter(o => 
      o.label.toLowerCase().includes(term) || 
      (o.sublabel && o.sublabel.toLowerCase().includes(term))
    );
  });

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleOpen(event: Event): void {
    event.stopPropagation();
    if (this.disabled) return;

    if (this.isOpen()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown(): void {
    this.checkDropdownPosition();
    this.isOpen.set(true);
    this.searchTerm.set('');
    this.highlightedIndex.set(-1);

    if (this.searchable) {
      setTimeout(() => {
        this.searchInput?.nativeElement.focus();
      }, 50);
    }
  }

  closeDropdown(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }

  private checkDropdownPosition(): void {
    if (this.placement === 'down') {
      this.openUpwards.set(false);
      return;
    }
    if (this.placement === 'up') {
      this.openUpwards.set(true);
      return;
    }

    if (!this.triggerBtn) return;
    const rect = this.triggerBtn.nativeElement.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    this.openUpwards.set(spaceBelow < 200 && spaceAbove > 220);
  }

  selectOption(opt: WorkoraSelectOption, event?: Event): void {
    if (event) event.stopPropagation();
    if (opt.disabled) return;

    this.selectedValue = opt.value;
    this.onChange(opt.value);
    this.selectionChange.emit(opt.value);
    this.closeDropdown();
    this.triggerBtn?.nativeElement.focus();
  }

  onClear(event: Event): void {
    event.stopPropagation();
    this.selectedValue = null;
    this.onChange(null);
    this.selectionChange.emit(null);
  }

  isSelected(val: any): boolean {
    return this.selectedValue === val || (this.selectedValue !== null && String(this.selectedValue) === String(val));
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.highlightedIndex.set(0);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!this.isOpen()) {
        this.openDropdown();
      } else {
        this.moveHighlight(1);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.isOpen()) {
        this.moveHighlight(-1);
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      if (!this.isOpen()) {
        event.preventDefault();
        this.openDropdown();
      } else if (this.highlightedIndex() >= 0) {
        event.preventDefault();
        const opts = this.filteredOptions();
        const opt = opts[this.highlightedIndex()];
        if (opt) this.selectOption(opt);
      }
    } else if (event.key === 'Escape') {
      if (this.isOpen()) {
        event.preventDefault();
        this.closeDropdown();
      }
    } else if (event.key === 'Tab') {
      this.closeDropdown();
    }
  }

  onSearchKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.moveHighlight(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveHighlight(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const opts = this.filteredOptions();
      const idx = this.highlightedIndex() >= 0 ? this.highlightedIndex() : 0;
      const opt = opts[idx];
      if (opt) this.selectOption(opt);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.closeDropdown();
      this.triggerBtn?.nativeElement.focus();
    }
  }

  private moveHighlight(step: number): void {
    const opts = this.filteredOptions();
    if (opts.length === 0) return;
    const current = this.highlightedIndex();
    let next = current + step;
    if (next < 0) next = opts.length - 1;
    if (next >= opts.length) next = 0;
    this.highlightedIndex.set(next);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }
}
