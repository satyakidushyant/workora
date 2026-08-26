import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal, ChangeDetectionStrategy, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceRecord } from '../../../../domain/models/attendance.model';

@Component({
  selector: 'app-clock-in-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-gradient-to-tr from-[#063B39] to-[#0E6E68] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
      
      <!-- Top Status & Live Clock -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/15 border border-white/25 text-[#3FA79B] inline-flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full" [ngClass]="isCheckedIn() ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'"></span>
            <span>{{ isCheckedIn() ? 'Clocked In (Active Shift)' : 'Not Clocked In' }}</span>
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold font-mono mt-3 tracking-tight">
            {{ currentTime() }}
          </h2>
          <p class="text-xs text-white/70 mt-0.5">
            {{ currentDate() }}
          </p>
        </div>

        <div class="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white shrink-0">
          <span class="material-symbols-outlined text-3xl">schedule</span>
        </div>
      </div>

      <!-- Live Elapsed Shift Timer (if checked in) -->
      @if (isCheckedIn()) {
        <div class="my-6 p-4 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-xs flex items-center justify-between">
          <div>
            <span class="text-[10px] uppercase font-bold text-white/60 tracking-wider">Elapsed Shift Time</span>
            <p class="text-xl font-extrabold font-mono text-[#3FA79B]">{{ elapsedDuration() }}</p>
          </div>
          <div class="text-right">
            <span class="text-[10px] uppercase font-bold text-white/60 tracking-wider">Checked In At</span>
            <p class="text-xs font-bold text-white">{{ todayRecord?.checkInTime | date:'shortTime' }}</p>
          </div>
        </div>
      } @else {
        <div class="my-6 p-4 bg-white/5 rounded-2xl border border-white/10 text-xs text-white/70 leading-relaxed">
          Record your arrival time to register working hours, breaks, and calculate payroll entitlements.
        </div>
      }

      <!-- Actions & Remarks -->
      <div class="space-y-3">
        <div class="relative">
          <input 
            type="text" 
            [(ngModel)]="remarks" 
            placeholder="Optional punch note (e.g. Working from Remote / Client site)..."
            class="w-full px-3.5 py-2 bg-white/10 hover:bg-white/15 focus:bg-white/20 text-xs text-white placeholder-white/50 rounded-xl border border-white/20 outline-none transition-all font-medium"
          />
        </div>

        <div class="flex items-center gap-3">
          @if (!isCheckedIn()) {
            <button 
              type="button" 
              (click)="onClockIn()"
              [disabled]="isSubmitting"
              class="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50">
              <span class="material-symbols-outlined text-base">login</span>
              <span>Clock In Now</span>
            </button>
          } @else {
            <button 
              type="button" 
              (click)="onClockOut()"
              [disabled]="isSubmitting"
              class="flex-1 py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-extrabold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50">
              <span class="material-symbols-outlined text-base">logout</span>
              <span>Clock Out (End Shift)</span>
            </button>
          }
        </div>
      </div>

    </div>
  `
})
export class ClockInWidgetComponent implements OnInit, OnDestroy {
  @Input() todayRecord: AttendanceRecord | null = null;
  @Input() isSubmitting = false;

  @Output() clockIn = new EventEmitter<string | undefined>();
  @Output() clockOut = new EventEmitter<string | undefined>();

  private readonly platformId = inject(PLATFORM_ID);

  readonly currentTime = signal<string>('00:00:00');
  readonly currentDate = signal<string>('');
  readonly elapsedDuration = signal<string>('00h 00m 00s');

  remarks = '';
  private timerId: any;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateClock();
      this.timerId = setInterval(() => this.updateClock(), 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  isCheckedIn(): boolean {
    return !!(this.todayRecord?.checkInTime && !this.todayRecord?.checkOutTime);
  }

  private updateClock(): void {
    const now = new Date();
    this.currentTime.set(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    this.currentDate.set(now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }));

    if (this.todayRecord?.checkInTime && !this.todayRecord.checkOutTime) {
      const checkInDate = new Date(this.todayRecord.checkInTime).getTime();
      const diffMs = Math.max(0, now.getTime() - checkInDate);
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      this.elapsedDuration.set(
        `${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`
      );
    }
  }

  onClockIn(): void {
    this.clockIn.emit(this.remarks || undefined);
    this.remarks = '';
  }

  onClockOut(): void {
    this.clockOut.emit(this.remarks || undefined);
    this.remarks = '';
  }
}
