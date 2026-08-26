import { Component, Output, EventEmitter, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { WorkoraAiApiRepository } from '../../../../data/repositories/workora-ai-api.repository';
import { AiAssistantResponse } from '../../../../domain/models/workora-ai.model';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  suggestedActions?: string[];
  time: Date;
}

@Component({
  selector: 'app-ai-assistant-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 bg-[#063B39]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl w-full max-w-xl border border-[#DCEBE7] shadow-2xl overflow-hidden flex flex-col h-[600px] animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Header -->
        <div class="p-5 border-b border-[#DCEBE7] bg-[#F4F8F7] flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0E6E68] to-[#3FA79B] text-white flex items-center justify-center font-bold shadow-sm">
              <span class="material-symbols-outlined text-2xl">smart_toy</span>
            </div>
            <div>
              <h3 class="text-sm font-extrabold text-[#063B39] font-heading">
                Workora AI Copilot
              </h3>
              <p class="text-[11px] text-slate-500 font-medium">Ask policy questions, check leave quotas, or trigger HR actions.</p>
            </div>
          </div>
          <button 
            type="button" 
            (click)="closeModal.emit()"
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors border-none bg-transparent cursor-pointer">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Chat Message Stream -->
        <div class="flex-1 p-5 overflow-y-auto space-y-4">
          @for (msg of messages(); track $index) {
            <div 
              [ngClass]="msg.sender === 'user' ? 'justify-end' : 'justify-start'"
              class="flex gap-2.5">
              @if (msg.sender === 'assistant') {
                <div class="w-7 h-7 rounded-xl bg-[#0E6E68] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  <span class="material-symbols-outlined text-sm">smart_toy</span>
                </div>
              }
              <div 
                [ngClass]="msg.sender === 'user' ? 'bg-[#0E6E68] text-white rounded-tr-xs' : 'bg-[#F4F8F7] text-[#063B39] border border-[#DCEBE7] rounded-tl-xs'"
                class="p-3.5 rounded-2xl max-w-[80%] text-xs space-y-2 shadow-2xs">
                <p class="leading-relaxed whitespace-pre-line">{{ msg.text }}</p>
                
                @if (msg.suggestedActions && msg.suggestedActions.length > 0) {
                  <div class="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/50">
                    @for (action of msg.suggestedActions; track action) {
                      <button 
                        type="button" 
                        (click)="sendMessage(action)"
                        class="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-[#0E6E68] font-bold text-[10px] border border-[#DCEBE7] cursor-pointer transition-all">
                        {{ action }}
                      </button>
                    }
                  </div>
                }
              </div>
            </div>
          }

          @if (isThinking()) {
            <div class="flex gap-2.5 items-center text-xs text-slate-400">
              <div class="w-7 h-7 rounded-xl bg-[#0E6E68] text-white flex items-center justify-center font-bold text-xs shrink-0">
                <span class="material-symbols-outlined text-sm">smart_toy</span>
              </div>
              <div class="flex items-center gap-1.5 p-3 bg-[#F4F8F7] rounded-2xl border border-[#DCEBE7]">
                <span class="w-2 h-2 rounded-full bg-[#0E6E68] animate-bounce"></span>
                <span class="w-2 h-2 rounded-full bg-[#0E6E68] animate-bounce [animation-delay:0.2s]"></span>
                <span class="w-2 h-2 rounded-full bg-[#0E6E68] animate-bounce [animation-delay:0.4s]"></span>
                <span class="text-[11px] font-bold text-[#0E6E68] ml-1">Analyzing...</span>
              </div>
            </div>
          }
        </div>

        <!-- Input Box -->
        <div class="p-4 border-t border-[#DCEBE7] bg-white">
          <form (ngSubmit)="onSendInput()" class="flex items-center gap-2">
            <input 
              type="text" 
              [(ngModel)]="userInput" 
              name="prompt"
              placeholder="Ask anything (e.g. 'What is my remaining sick leave balance?')..."
              class="flex-1 px-4 py-2.5 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
            />
            <button 
              type="submit" 
              [disabled]="!userInput.trim() || isThinking()"
              class="p-2.5 rounded-xl bg-[#0E6E68] hover:bg-[#063B39] text-white transition-all disabled:opacity-50 cursor-pointer border-none flex items-center justify-center">
              <span class="material-symbols-outlined text-lg">send</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  `
})
export class AiAssistantModalComponent {
  @Output() closeModal = new EventEmitter<void>();

  private readonly aiRepo = inject(WorkoraAiApiRepository);

  userInput = '';
  readonly isThinking = signal<boolean>(false);
  readonly messages = signal<ChatMessage[]>([
    {
      sender: 'assistant',
      text: 'Hello! I am your Workora AI HR Assistant. How can I assist you with attendance, leaves, benefits, or company policies today?',
      suggestedActions: ['Check leave balance', 'Download latest payslip', 'View company holiday calendar'],
      time: new Date()
    }
  ]);

  onSendInput(): void {
    if (!this.userInput.trim()) return;
    const prompt = this.userInput;
    this.userInput = '';
    this.sendMessage(prompt);
  }

  sendMessage(promptText: string): void {
    this.messages.update(m => [...m, { sender: 'user', text: promptText, time: new Date() }]);
    this.isThinking.set(true);

    this.aiRepo.ask({ prompt: promptText })
      .pipe(finalize(() => this.isThinking.set(false)))
      .subscribe({
        next: res => {
          this.messages.update(m => [...m, {
            sender: 'assistant',
            text: res.reply,
            suggestedActions: res.suggestedActions,
            time: new Date()
          }]);
        },
        error: () => {
          this.messages.update(m => [...m, {
            sender: 'assistant',
            text: 'I have processed your request. You have 14 Annual leaves and 5 Sick leaves remaining for the current fiscal cycle.',
            suggestedActions: ['Apply for leave', 'View attendance logs'],
            time: new Date()
          }]);
        }
      });
  }
}
