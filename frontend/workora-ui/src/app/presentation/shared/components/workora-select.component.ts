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
  ChangeDetectorRef,
  ViewChild,
  OnDestroy
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

export interface DropdownPosition {
  top: number;
  bottom: number;
  left: number;
  width: number;
  isUpwards: boolean;
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
        class="w-full flex items-center justify-between gap-2.5 px-3.5 h-10 rounded-xl border text-xs font-semibold text-[#102A2A] transition-all cursor-pointer outline-none text-left">
        
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
          @if (clearable && selectedValue() !== null && selectedValue() !== undefined && !disabled) {
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

      <!-- Dropdown Menu Panel (Teleported to document.body on open to avoid modal backdrop/transform clipping) -->
      @if (isOpen()) {
        <div 
          #menuPanel
          (click)="$event.stopPropagation()"
          [ngStyle]="dropdownStyles()"
          class="fixed z-[2147483647] bg-white border border-[#DDE9E6] rounded-xl shadow-2xl p-1.5 flex flex-col animate-in fade-in zoom-in-95 duration-150 min-w-[160px]"
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
              @for (opt of filteredOptions(); track (opt.value !== null && opt.value !== undefined ? (opt.value + '_' + idx) : idx); let idx = $index) {
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
export class WorkoraSelectComponent implements ControlValueAccessor, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('triggerBtn') triggerBtn?: ElementRef<HTMLButtonElement>;
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;
  @ViewChild('optionsContainer') optionsContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('menuPanel') menuPanel?: ElementRef<HTMLDivElement>;

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

  readonly selectedValue = signal<any>(null);
  readonly isOpen = signal<boolean>(false);
  readonly dropdownPosition = signal<DropdownPosition | null>(null);
  readonly searchTerm = signal<string>('');
  readonly highlightedIndex = signal<number>(-1);

  readonly selectedOption = computed<WorkoraSelectOption | null>(() => {
    const val = this.selectedValue();
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

  readonly dropdownStyles = computed(() => {
    if (!this.isOpen()) return {};
    const pos = this.dropdownPosition();
    if (!pos) return {};

    const styles: Record<string, string> = {
      position: 'fixed',
      left: `${pos.left}px`,
      width: `${pos.width}px`,
      minWidth: `${pos.width}px`,
      zIndex: '2147483647'
    };

    if (pos.isUpwards) {
      styles['bottom'] = `${window.innerHeight - pos.top + 6}px`;
    } else {
      styles['top'] = `${pos.bottom + 6}px`;
    }

    return styles;
  });

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  private onScrollOrResizeCapture = (event: Event): void => {
    if (this.isOpen()) {
      this.updateDropdownPosition();
    }
  };

  ngOnDestroy(): void {
    this.detachScrollListeners();
    this.removeMenuFromDocument();
  }

  writeValue(value: any): void {
    this.selectedValue.set(value);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
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
    this.isOpen.set(true);
    this.searchTerm.set('');
    this.highlightedIndex.set(-1);

    // Force Angular to render the view child in template before moving to document.body
    this.cdr.detectChanges();

    if (this.menuPanel?.nativeElement && this.menuPanel.nativeElement.parentNode !== document.body) {
      document.body.appendChild(this.menuPanel.nativeElement);
    }

    this.updateDropdownPosition();
    this.attachScrollListeners();
    this.cdr.markForCheck();

    if (this.searchable) {
      setTimeout(() => {
        this.searchInput?.nativeElement.focus();
      }, 50);
    }
  }

  closeDropdown(): void {
    if (this.isOpen()) {
      this.detachScrollListeners();
      this.removeMenuFromDocument();
      this.isOpen.set(false);
      this.onTouched();
      this.cdr.markForCheck();
    }
  }

  private removeMenuFromDocument(): void {
    if (this.menuPanel?.nativeElement && this.menuPanel.nativeElement.parentNode === document.body) {
      document.body.removeChild(this.menuPanel.nativeElement);
    }
  }

  private attachScrollListeners(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onScrollOrResizeCapture, true);
      window.addEventListener('resize', this.onScrollOrResizeCapture, true);
    }
  }

  private detachScrollListeners(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScrollOrResizeCapture, true);
      window.removeEventListener('resize', this.onScrollOrResizeCapture, true);
    }
  }

  private updateDropdownPosition(): void {
    if (!this.triggerBtn) return;
    const rect = this.triggerBtn.nativeElement.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let isUpwards = false;
    if (this.placement === 'up') {
      isUpwards = true;
    } else if (this.placement === 'down') {
      isUpwards = false;
    } else {
      isUpwards = spaceBelow < 240 && spaceAbove > 240;
    }

    const width = rect.width;
    const maxLeft = Math.max(12, window.innerWidth - width - 16);
    const left = Math.min(Math.max(12, rect.left), maxLeft);

    this.dropdownPosition.set({
      top: rect.top,
      bottom: rect.bottom,
      left,
      width,
      isUpwards
    });
  }

  selectOption(opt: WorkoraSelectOption, event?: Event): void {
    if (event) event.stopPropagation();
    if (opt.disabled) return;

    this.selectedValue.set(opt.value);
    this.onChange(opt.value);
    this.selectionChange.emit(opt.value);
    this.closeDropdown();
    this.triggerBtn?.nativeElement.focus();
    this.cdr.markForCheck();
  }

  onClear(event: Event): void {
    event.stopPropagation();
    this.selectedValue.set(null);
    this.onChange(null);
    this.selectionChange.emit(null);
    this.cdr.markForCheck();
  }

  isSelected(val: any): boolean {
    const current = this.selectedValue();
    return current === val || (current !== null && current !== undefined && String(current) === String(val));
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

    setTimeout(() => {
      if (this.optionsContainer?.nativeElement) {
        const container = this.optionsContainer.nativeElement;
        const items = container.children;
        if (items[next]) {
          (items[next] as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    }, 10);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) return;
    const target = event.target as Node;
    const insideHost = this.elementRef.nativeElement.contains(target);
    const insideMenu = this.menuPanel?.nativeElement.contains(target);
    if (!insideHost && !insideMenu) {
      this.closeDropdown();
    }
  }
}

