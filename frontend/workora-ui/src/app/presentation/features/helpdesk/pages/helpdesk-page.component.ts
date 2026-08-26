import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { HelpdeskApiRepository } from '../../../../data/repositories/helpdesk-api.repository';
import { HelpdeskTicket, CreateTicketParams, ResolveTicketParams, AddCommentParams } from '../../../../domain/models/helpdesk.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { CreateTicketModalComponent } from '../components/create-ticket-modal.component';
import { TicketDetailModalComponent } from '../components/ticket-detail-modal.component';

@Component({
  selector: 'app-helpdesk-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    WorkoraSkeletonComponent,
    WorkoraEmptyStateComponent,
    CreateTicketModalComponent,
    TicketDetailModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68]">
              <span class="material-symbols-outlined text-2xl">support_agent</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Support &amp; IT Helpdesk
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Manage inquiries, technical support tickets, payroll disputes, and SLA resolution lifecycles.
          </p>
        </div>

        <button 
          type="button" 
          (click)="isCreateModalOpen.set(true)"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none">
          <span class="material-symbols-outlined text-base">add</span>
          <span>Raise Ticket</span>
        </button>
      </div>

      <!-- Tickets Table -->
      <div class="bg-white rounded-3xl border border-[#DCEBE7] shadow-xs overflow-hidden">
        <div class="p-5 border-b border-[#DCEBE7] flex items-center justify-between">
          <h3 class="text-sm font-extrabold text-[#063B39]">Support Inquiries &amp; Tickets</h3>
        </div>

        @if (isLoading()) {
          <div class="p-6">
            <app-workora-skeleton type="table" [count]="5"></app-workora-skeleton>
          </div>
        } @else if (tickets().length === 0) {
          <div class="p-12">
            <app-workora-empty-state 
              icon="confirmation_number" 
              title="No Support Tickets"
              description="No tickets have been raised yet."
              actionLabel="Raise First Ticket"
              (actionClick)="isCreateModalOpen.set(true)"
            ></app-workora-empty-state>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-[#F4F8F7]/80 border-b border-[#DCEBE7] text-[11px] font-extrabold uppercase tracking-wider text-[#063B39]/70">
                  <th class="py-3.5 px-5">Ticket</th>
                  <th class="py-3.5 px-4">Category</th>
                  <th class="py-3.5 px-4">Raised By</th>
                  <th class="py-3.5 px-4">Priority</th>
                  <th class="py-3.5 px-4">Status</th>
                  <th class="py-3.5 px-4">Created</th>
                  <th class="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#DCEBE7]/70">
                @for (t of tickets(); track t.id) {
                  <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                    <td class="py-3.5 px-5">
                      <div class="flex items-center gap-2">
                        <span class="font-mono text-[10px] text-slate-400 font-bold">#{{ t.ticketNumber }}</span>
                        <p class="font-bold text-[#063B39]">{{ t.subject }}</p>
                      </div>
                    </td>
                    <td class="py-3.5 px-4 font-semibold text-slate-700">
                      {{ t.category }}
                    </td>
                    <td class="py-3.5 px-4 text-slate-600">
                      {{ t.raisedByEmployeeName || 'Employee' }}
                    </td>
                    <td class="py-3.5 px-4">
                      <span 
                        [ngClass]="{
                          'text-rose-600 font-extrabold': t.priority === 'Urgent' || t.priority === 'High',
                          'text-slate-600 font-semibold': t.priority === 'Medium' || t.priority === 'Low'
                        }">
                        {{ t.priority }}
                      </span>
                    </td>
                    <td class="py-3.5 px-4">
                      <span 
                        [ngClass]="{
                          'bg-amber-50 text-amber-700 border-amber-200': t.status === 'Open',
                          'bg-blue-50 text-blue-700 border-blue-200': t.status === 'InProgress',
                          'bg-emerald-50 text-emerald-700 border-emerald-200': t.status === 'Resolved',
                          'bg-slate-100 text-slate-600 border-slate-200': t.status === 'Closed'
                        }"
                        class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border">
                        {{ t.status }}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 text-slate-500 font-mono">
                      {{ t.createdAt | date:'shortDate' }}
                    </td>
                    <td class="py-3.5 px-5 text-right">
                      <button 
                        type="button" 
                        (click)="openDetailModal(t)"
                        class="px-3 py-1 rounded-lg bg-[#0E6E68]/10 hover:bg-[#0E6E68]/20 text-[#0E6E68] text-[11px] font-bold transition-all border-none cursor-pointer">
                        View Thread
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- Modals -->
      @if (isCreateModalOpen()) {
        <app-create-ticket-modal
          [isSubmitting]="isSubmitting()"
          (closeModal)="isCreateModalOpen.set(false)"
          (createTicket)="onSaveTicket($event)"
        ></app-create-ticket-modal>
      }

      @if (isDetailModalOpen()) {
        <app-ticket-detail-modal
          [ticket]="selectedTicket()"
          [isSubmitting]="isSubmitting()"
          (closeModal)="isDetailModalOpen.set(false)"
          (addComment)="onAddComment($event)"
          (resolveTicket)="onResolveTicket($event)"
          (closeTicket)="onCloseTicket($event)"
        ></app-ticket-detail-modal>
      }

    </div>
  `
})
export class HelpdeskPageComponent implements OnInit {
  private readonly helpdeskRepo = inject(HelpdeskApiRepository);
  private readonly notificationService = inject(NotificationService);

  readonly tickets = signal<HelpdeskTicket[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);

  readonly isCreateModalOpen = signal<boolean>(false);
  readonly isDetailModalOpen = signal<boolean>(false);
  readonly selectedTicket = signal<HelpdeskTicket | null>(null);

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.isLoading.set(true);
    this.helpdeskRepo.getTickets(1)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: t => this.tickets.set(t),
        error: () => {}
      });
  }

  openDetailModal(ticket: HelpdeskTicket): void {
    this.selectedTicket.set(ticket);
    this.isDetailModalOpen.set(true);
    this.helpdeskRepo.getTicketById(ticket.id).subscribe(t => this.selectedTicket.set(t));
  }

  onSaveTicket(params: CreateTicketParams): void {
    this.isSubmitting.set(true);
    this.helpdeskRepo.createTicket(params)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.isCreateModalOpen.set(false);
          this.notificationService.showSuccess('Support ticket created.');
          this.loadTickets();
        },
        error: err => this.notificationService.showError(err.message || 'Failed to create ticket.')
      });
  }

  onAddComment(params: AddCommentParams): void {
    this.helpdeskRepo.addComment(params).subscribe({
      next: () => {
        this.notificationService.showSuccess('Reply posted.');
        if (this.selectedTicket()) {
          this.helpdeskRepo.getTicketById(this.selectedTicket()!.id).subscribe(t => this.selectedTicket.set(t));
        }
      },
      error: err => this.notificationService.showError(err.message || 'Failed to post reply.')
    });
  }

  onResolveTicket(params: ResolveTicketParams): void {
    this.helpdeskRepo.resolveTicket(params).subscribe({
      next: t => {
        this.selectedTicket.set(t);
        this.notificationService.showSuccess('Ticket marked as resolved.');
        this.loadTickets();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to resolve ticket.')
    });
  }

  onCloseTicket(id: number): void {
    this.helpdeskRepo.closeTicket(id).subscribe({
      next: t => {
        this.selectedTicket.set(t);
        this.notificationService.showSuccess('Ticket closed.');
        this.loadTickets();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to close ticket.')
    });
  }
}
