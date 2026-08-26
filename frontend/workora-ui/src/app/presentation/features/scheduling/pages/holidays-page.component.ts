import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { HolidayApiRepository } from '../../../../data/repositories/holiday-api.repository';
import { Holiday, WeeklyOffPolicy, SaveHolidayParams } from '../../../../domain/models/holiday.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';

@Component({
  selector: 'app-holidays-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WorkoraSkeletonComponent,
    WorkoraEmptyStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68]">
              <span class="material-symbols-outlined text-2xl">celebration</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Holidays &amp; Weekly Offs
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Annual corporate paid holidays, regional festival closures, and weekend off policies.
          </p>
        </div>

        <button 
          type="button" 
          (click)="openAddHolidayModal()"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none">
          <span class="material-symbols-outlined text-base">event_note</span>
          <span>Add Holiday</span>
        </button>
      </div>

      <!-- Main Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Holidays List -->
        <div class="lg:col-span-2 space-y-4">
          <div class="bg-white rounded-3xl p-6 border border-[#DCEBE7] shadow-xs space-y-4">
            <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-3">
              <h3 class="text-sm font-extrabold text-[#063B39]">
                Calendar Year {{ currentYear }} Holidays ({{ holidays().length }})
              </h3>
            </div>

            @if (isLoading()) {
              <app-workora-skeleton type="table" [count]="4"></app-workora-skeleton>
            } @else if (holidays().length === 0) {
              <div class="p-10">
                <app-workora-empty-state 
                  icon="celebration" 
                  title="No Holidays Configured"
                  description="Add public or regional holidays for the current calendar year."
                  actionLabel="Add First Holiday"
                  (actionClick)="openAddHolidayModal()"
                ></app-workora-empty-state>
              </div>
            } @else {
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                @for (h of holidays(); track h.id) {
                  <div class="p-4 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7] flex items-center justify-between group hover:border-[#0E6E68]/30 transition-all">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-[#0E6E68] text-white flex flex-col items-center justify-center font-bold">
                        <span class="text-[9px] uppercase font-semibold leading-none">{{ h.date | date:'MMM' }}</span>
                        <span class="text-sm font-extrabold leading-none mt-0.5">{{ h.date | date:'d' }}</span>
                      </div>
                      <div>
                        <h4 class="text-xs font-extrabold text-[#063B39]">{{ h.name }}</h4>
                        <p class="text-[11px] text-slate-500">{{ h.type }} • {{ h.date | date:'EEEE' }}</p>
                      </div>
                    </div>

                    <button 
                      type="button" 
                      (click)="onDeleteHoliday(h.id)"
                      class="text-slate-400 hover:text-rose-600 transition-colors p-1.5 border-none bg-transparent cursor-pointer opacity-0 group-hover:opacity-100"
                      title="Delete Holiday">
                      <span class="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Weekly-Off Schedule Card -->
        <div class="space-y-4">
          <div class="bg-white rounded-3xl p-6 border border-[#DCEBE7] shadow-xs space-y-4">
            <div class="border-b border-[#DCEBE7] pb-3">
              <h3 class="text-sm font-extrabold text-[#063B39]">Weekly Off Schedule</h3>
              <p class="text-xs text-slate-500">Corporate non-working weekend configuration.</p>
            </div>

            <div class="space-y-2 text-xs">
              <label class="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F4F8F7] transition-colors cursor-pointer">
                <span class="font-bold text-[#063B39]">Saturday</span>
                <input type="checkbox" [(ngModel)]="weeklyOff.saturdayOff" class="rounded text-[#0E6E68]" />
              </label>

              <label class="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F4F8F7] transition-colors cursor-pointer">
                <span class="font-bold text-[#063B39]">Sunday</span>
                <input type="checkbox" [(ngModel)]="weeklyOff.sundayOff" class="rounded text-[#0E6E68]" />
              </label>

              <label class="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F4F8F7] transition-colors cursor-pointer">
                <span class="font-bold text-[#063B39]">Alternate Saturdays Off</span>
                <input type="checkbox" [(ngModel)]="weeklyOff.alternateSaturdayOff" class="rounded text-[#0E6E68]" />
              </label>
            </div>

            <div class="pt-3 border-t border-[#DCEBE7]">
              <button 
                type="button" 
                (click)="onSaveWeeklyOff()"
                class="w-full py-2.5 rounded-xl bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold transition-all shadow-xs cursor-pointer border-none">
                Save Weekend Policy
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- Add Holiday Modal -->
      @if (isAddModalOpen()) {
        <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-[#DCEBE7] shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68] flex items-center justify-center font-bold">
                  <span class="material-symbols-outlined">event</span>
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-[#063B39] font-heading">Add Annual Holiday</h3>
                  <p class="text-xs text-slate-500">Record public or optional festival date.</p>
                </div>
              </div>
              <button (click)="isAddModalOpen.set(false)" class="text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <form [formGroup]="holidayForm" (ngSubmit)="onSaveHoliday()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-[#063B39] mb-1">Holiday Name <span class="text-rose-500">*</span></label>
                <input type="text" formControlName="name" placeholder="e.g. New Year's Day" class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Date <span class="text-rose-500">*</span></label>
                  <input type="date" formControlName="date" class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all" />
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#063B39] mb-1">Type <span class="text-rose-500">*</span></label>
                  <select formControlName="type" class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
                    <option value="Mandatory">Public / Mandatory</option>
                    <option value="Optional">Optional / Restricted</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-[#063B39] mb-1">Description</label>
                <input type="text" formControlName="description" placeholder="Optional notes" class="w-full px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all" />
              </div>

              <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#DCEBE7]">
                <button type="button" (click)="isAddModalOpen.set(false)" class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border-none bg-transparent">
                  Cancel
                </button>
                <button type="submit" [disabled]="holidayForm.invalid || isSubmitting()" class="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold shadow-xs cursor-pointer border-none">
                  Save Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      }

    </div>
  `
})
export class HolidaysPageComponent implements OnInit {
  private readonly holidayRepo = inject(HolidayApiRepository);
  private readonly notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly currentYear = new Date().getFullYear();
  readonly holidays = signal<Holiday[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly isAddModalOpen = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);

  weeklyOff: WeeklyOffPolicy = {
    companyId: 1,
    mondayOff: false,
    tuesdayOff: false,
    wednesdayOff: false,
    thursdayOff: false,
    fridayOff: false,
    saturdayOff: true,
    sundayOff: true,
    alternateSaturdayOff: false
  };

  readonly holidayForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    date: [new Date().toISOString().substring(0, 10), [Validators.required]],
    type: ['Mandatory', [Validators.required]],
    description: ['']
  });

  ngOnInit(): void {
    this.loadHolidays();
    this.loadWeeklyOff();
  }

  loadHolidays(): void {
    this.isLoading.set(true);
    this.holidayRepo.getHolidays(this.currentYear)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: h => this.holidays.set(h),
        error: () => {}
      });
  }

  loadWeeklyOff(): void {
    this.holidayRepo.getWeeklyOffPolicy(1).subscribe({
      next: pol => this.weeklyOff = { ...pol },
      error: () => {}
    });
  }

  openAddHolidayModal(): void {
    this.holidayForm.reset({
      date: new Date().toISOString().substring(0, 10),
      type: 'Mandatory'
    });
    this.isAddModalOpen.set(true);
  }

  onSaveHoliday(): void {
    if (this.holidayForm.invalid) return;
    const v = this.holidayForm.value;

    this.isSubmitting.set(true);
    this.holidayRepo.createHoliday({
      companyId: 1,
      name: v.name,
      date: v.date,
      type: v.type,
      description: v.description || null
    })
    .pipe(finalize(() => this.isSubmitting.set(false)))
    .subscribe({
      next: () => {
        this.isAddModalOpen.set(false);
        this.notificationService.showSuccess('Holiday added to calendar.');
        this.loadHolidays();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to add holiday.')
    });
  }

  onDeleteHoliday(id: number): void {
    this.holidayRepo.deleteHoliday(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Holiday removed.');
        this.loadHolidays();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to delete holiday.')
    });
  }

  onSaveWeeklyOff(): void {
    this.holidayRepo.updateWeeklyOffPolicy(this.weeklyOff).subscribe({
      next: () => this.notificationService.showSuccess('Weekend policy saved.'),
      error: err => this.notificationService.showError(err.message || 'Failed to save weekend policy.')
    });
  }
}
