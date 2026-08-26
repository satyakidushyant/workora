import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { FieldTrackingApiRepository } from '../../../../data/repositories/field-tracking-api.repository';
import { LiveLocation, FieldVisit, CheckInVisitParams } from '../../../../domain/models/field-tracking.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';

@Component({
  selector: 'app-field-tracking-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
              <span class="material-symbols-outlined text-2xl">location_on</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Field Force &amp; Client Visit Tracking
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Monitor real-time GPS telemetry, client on-site check-ins, and travel distance logs.
          </p>
        </div>

        <button 
          type="button" 
          (click)="onPromptCheckIn()"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none">
          <span class="material-symbols-outlined text-base">add_location_alt</span>
          <span>Log Client Visit</span>
        </button>
      </div>

      <!-- Live Agents Telemetry Grid -->
      <div class="space-y-4">
        <h3 class="text-sm font-extrabold text-[#063B39]">Live Field Staff Telemetry</h3>

        @if (isLoading()) {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            @for (i of [1,2,3]; track i) {
              <app-workora-skeleton type="card"></app-workora-skeleton>
            }
          </div>
        } @else if (locations().length === 0) {
          <div class="bg-white rounded-3xl p-8 border border-[#DCEBE7] shadow-xs">
            <app-workora-empty-state 
              icon="pin_drop" 
              title="No Active Field Agents"
              description="Field employees will appear here once their GPS pings are logged."
            ></app-workora-empty-state>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            @for (loc of locations(); track loc.employeeId) {
              <div class="bg-white p-5 rounded-3xl border border-[#DCEBE7] shadow-xs space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68] flex items-center justify-center font-bold text-xs">
                      {{ loc.employeeName?.substring(0,2)?.toUpperCase() || 'FA' }}
                    </div>
                    <div>
                      <h4 class="font-extrabold text-xs text-[#063B39]">{{ loc.employeeName }}</h4>
                      <p class="text-[10px] text-slate-400 font-mono">{{ loc.employeeCode }}</p>
                    </div>
                  </div>
                  <span class="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Live</span>
                  </span>
                </div>

                <div class="p-3 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7] space-y-1 text-xs">
                  <div class="flex items-center justify-between text-slate-500">
                    <span>Coordinates:</span>
                    <strong class="font-mono text-slate-700">{{ loc.latitude | number:'1.4-4' }}, {{ loc.longitude | number:'1.4-4' }}</strong>
                  </div>
                  <div class="flex items-center justify-between text-slate-500">
                    <span>Battery:</span>
                    <strong class="text-[#0E6E68]">{{ loc.batteryPercentage }}%</strong>
                  </div>
                  <div class="flex items-center justify-between text-slate-500">
                    <span>Last Ping:</span>
                    <span class="text-slate-600">{{ loc.recordedAt | date:'shortTime' }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>

    </div>
  `
})
export class FieldTrackingPageComponent implements OnInit {
  private readonly fieldRepo = inject(FieldTrackingApiRepository);
  private readonly notificationService = inject(NotificationService);

  readonly locations = signal<LiveLocation[]>([]);
  readonly visits = signal<FieldVisit[]>([]);
  readonly isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.fieldRepo.getLiveLocations()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: l => this.locations.set(l),
        error: () => {}
      });
  }

  onPromptCheckIn(): void {
    const client = prompt('Enter Client Name / Account:');
    if (!client) return;
    const purpose = prompt('Enter Visit Purpose (Sales / Support / Installation):') || 'Client Meeting';

    this.fieldRepo.checkInVisit({
      employeeId: 1,
      clientName: client,
      visitPurpose: purpose,
      checkInLatitude: 37.7749,
      checkInLongitude: -122.4194,
      checkInAddress: 'Financial District, Suite 400'
    }).subscribe({
      next: () => {
        this.notificationService.showSuccess(`Checked in at ${client}.`);
        this.loadData();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to check-in visit.')
    });
  }
}
