import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HelpdeskTicket, ResolveTicketParams, AddCommentParams } from '../../../../domain/models/helpdesk.model';

@Component({
  selector: 'app-ticket-detail-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl border border-[#DCEBE7] shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[#DCEBE7] pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <span class="material-symbols-outlined">forum</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs font-bold text-slate-400">#{{ ticket?.ticketNumber }}</span>
                <span 
                  [ngClass]="{
                    'bg-amber-50 text-amber-700 border-amber-200': ticket?.status === 'Open',
                    'bg-blue-50 text-blue-700 border-blue-200': ticket?.status === 'InProgress',
                    'bg-emerald-50 text-emerald-700 border-emerald-200': ticket?.status === 'Resolved',
                    'bg-slate-100 text-slate-600 border-slate-200': ticket?.status === 'Closed'
                  }"
                  class="px-2 py-0.5 rounded-full text-[10px] font-extrabold border">
                  {{ ticket?.status }}
                </span>
              </div>
              <h3 class="text-base font-extrabold text-[#063B39] font-heading mt-0.5">
                {{ ticket?.subject }}
              </h3>
            </div>
          </div>
          <button 
            type="button" 
            (click)="closeModal.emit()"
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Ticket Info & Description -->
        <div class="p-4 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7] space-y-2 text-xs">
          <div class="flex items-center justify-between text-slate-500 font-medium">
            <span>Category: <strong class="text-[#063B39]">{{ ticket?.category }}</strong></span>
            <span>Priority: <strong class="text-rose-600">{{ ticket?.priority }}</strong></span>
            <span>Raised By: <strong class="text-slate-700">{{ ticket?.raisedByEmployeeName }}</strong></span>
          </div>
          <div class="pt-2 border-t border-[#DCEBE7]/70 text-slate-700 font-normal">
            {{ ticket?.description }}
          </div>
        </div>

        <!-- Resolution Notes (if resolved) -->
        @if (ticket?.resolutionNotes) {
          <div class="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
            <span class="font-bold flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm">check_circle</span>
              <span>Resolution Notes</span>
            </span>
            <p>{{ ticket?.resolutionNotes }}</p>
          </div>
        }

        <!-- Comments Thread -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold text-[#063B39]">Conversation Thread</h4>
          
          <div class="max-h-60 overflow-y-auto space-y-2.5 p-1">
            @if (!ticket?.comments || ticket?.comments?.length === 0) {
              <p class="text-xs text-slate-400 italic">No comments yet. Post the first response below.</p>
            } @else {
              @for (c of ticket?.comments; track c.id) {
                <div class="p-3 rounded-2xl bg-white border border-[#DCEBE7] shadow-2xs space-y-1 text-xs">
                  <div class="flex items-center justify-between text-[10px] text-slate-400">
                    <span class="font-bold text-[#0E6E68]">{{ c.authorName || 'Support Agent' }}</span>
                    <span>{{ c.createdAt | date:'short' }}</span>
                  </div>
                  <p class="text-slate-700">{{ c.commentText }}</p>
                </div>
              }
            }
          </div>
        </div>

        <!-- Add Reply / Resolution Action Form -->
        @if (ticket?.status !== 'Closed') {
          <form [formGroup]="replyForm" (ngSubmit)="onAddReply()" class="space-y-3 pt-4 border-t border-[#DCEBE7]">
            <div>
              <label class="block text-xs font-bold text-[#063B39] mb-1">Post Response / Reply</label>
              <div class="flex gap-2">
                <input 
                  type="text" 
                  formControlName="commentText" 
                  placeholder="Type a message or status update..."
                  class="flex-1 px-3.5 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                />
                <button 
                  type="submit" 
                  [disabled]="replyForm.invalid"
                  class="px-4 py-2.5 rounded-xl bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer border-none flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">send</span>
                  <span>Reply</span>
                </button>
              </div>
            </div>
          </form>

          <div class="flex items-center justify-between pt-4 border-t border-[#DCEBE7]">
            @if (ticket?.status !== 'Resolved') {
              <button 
                type="button" 
                (click)="onResolvePrompt()"
                class="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer border-none flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm">task_alt</span>
                <span>Mark Resolved</span>
              </button>
            } @else {
              <button 
                type="button" 
                (click)="closeTicket.emit(ticket!.id)"
                class="px-4 py-2 text-xs font-bold rounded-xl bg-slate-700 hover:bg-slate-800 text-white transition-all cursor-pointer border-none flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm">lock</span>
                <span>Close Ticket</span>
              </button>
            }

            <button 
              type="button" 
              (click)="closeModal.emit()"
              class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border-none bg-transparent">
              Dismiss
            </button>
          </div>
        }

      </div>
    </div>
  `
})
export class TicketDetailModalComponent {
  @Input() ticket: HelpdeskTicket | null = null;
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() addComment = new EventEmitter<AddCommentParams>();
  @Output() resolveTicket = new EventEmitter<ResolveTicketParams>();
  @Output() closeTicket = new EventEmitter<number>();

  private readonly fb = inject(FormBuilder);

  readonly replyForm: FormGroup = this.fb.group({
    commentText: ['', [Validators.required, Validators.minLength(2)]]
  });

  onAddReply(): void {
    if (this.replyForm.invalid || !this.ticket) return;
    this.addComment.emit({
      ticketId: this.ticket.id,
      userId: 1,
      commentText: this.replyForm.value.commentText
    });
    this.replyForm.reset();
  }

  onResolvePrompt(): void {
    if (!this.ticket) return;
    const notes = prompt('Enter resolution summary / root-cause notes:');
    if (notes) {
      this.resolveTicket.emit({
        ticketId: this.ticket.id,
        resolutionNotes: notes
      });
    }
  }
}
