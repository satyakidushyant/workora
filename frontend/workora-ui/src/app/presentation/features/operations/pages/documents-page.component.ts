import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { DocumentApiRepository } from '../../../../data/repositories/document-api.repository';
import { DocumentItem, CreateDocumentParams } from '../../../../domain/models/document.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraPaginationComponent } from '../../../shared/components/workora-pagination.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { WorkoraConfirmDialogComponent } from '../../../shared/components/workora-confirm-dialog.component';

@Component({
  selector: 'app-documents-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WorkoraSkeletonComponent,
    WorkoraPaginationComponent,
    WorkoraEmptyStateComponent,
    WorkoraConfirmDialogComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68]">
              <span class="material-symbols-outlined text-2xl">folder_shared</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
              Document Center &amp; Policies
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Central repository for employee IDs, contracts, company handbook, and compliance certifications.
          </p>
        </div>

        <button 
          type="button" 
          (click)="openUploadModal()"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer border-none">
          <span class="material-symbols-outlined text-base">upload_file</span>
          <span>Upload Document</span>
        </button>
      </div>

      <!-- Controls -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#DCEBE7] shadow-2xs">
        <div class="relative flex-1 max-w-md">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (ngModelChange)="onSearch()"
            placeholder="Search documents by title or filename..."
            class="w-full pl-9 pr-4 py-2 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
          />
        </div>

        <select 
          [(ngModel)]="selectedCategory" 
          (ngModelChange)="onCategoryChange()"
          class="px-3.5 py-2 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
          <option [ngValue]="undefined">All Document Categories</option>
          <option value="Policy">Company Policies</option>
          <option value="Contract">Employment Contracts</option>
          <option value="Identification">Identity &amp; Passport</option>
          <option value="TaxForm">Tax Forms</option>
          <option value="Certification">Certifications</option>
        </select>
      </div>

      <!-- Document Table / Cards -->
      <div class="bg-white rounded-3xl border border-[#DCEBE7] shadow-xs overflow-hidden">
        @if (isLoading()) {
          <div class="p-6">
            <app-workora-skeleton type="table" [count]="5"></app-workora-skeleton>
          </div>
        } @else if (documents().length === 0) {
          <div class="p-12">
            <app-workora-empty-state 
              icon="folder_off" 
              title="No Documents Uploaded"
              description="Upload official company policies, agreements, or employee records."
              actionLabel="Upload First Document"
              (actionClick)="openUploadModal()"
            ></app-workora-empty-state>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-[#F4F8F7]/80 border-b border-[#DCEBE7] text-[11px] font-extrabold uppercase tracking-wider text-[#063B39]/70">
                  <th class="py-3.5 px-5">Document Title</th>
                  <th class="py-3.5 px-4">Category</th>
                  <th class="py-3.5 px-4">Associated Member</th>
                  <th class="py-3.5 px-4">File Size</th>
                  <th class="py-3.5 px-4">Uploaded</th>
                  <th class="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#DCEBE7]/70">
                @for (doc of documents(); track doc.id) {
                  <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                    <td class="py-3.5 px-5">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                          <span class="material-symbols-outlined text-lg">description</span>
                        </div>
                        <div>
                          <p class="font-bold text-[#063B39]">{{ doc.title }}</p>
                          <p class="text-[10px] text-slate-400 font-mono">{{ doc.fileName }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="py-3.5 px-4">
                      <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#DCEBE7] text-[#063B39]">
                        {{ doc.category }}
                      </span>
                    </td>
                    <td class="py-3.5 px-4">
                      <span class="font-semibold text-slate-700">{{ doc.employeeName || 'Company-Wide' }}</span>
                    </td>
                    <td class="py-3.5 px-4 text-slate-500 font-medium">
                      {{ (doc.fileSizeBytes / 1024 / 1024) | number:'1.1-2' }} MB
                    </td>
                    <td class="py-3.5 px-4 text-slate-500">
                      {{ doc.createdAt | date:'mediumDate' }}
                    </td>
                    <td class="py-3.5 px-5 text-right">
                      <div class="inline-flex items-center gap-1.5">
                        <a 
                          [href]="doc.filePath" 
                          target="_blank" 
                          class="p-1.5 rounded-lg text-slate-500 hover:text-[#0E6E68] hover:bg-[#3FA79B]/10 transition-colors no-underline inline-flex items-center"
                          title="Download / View">
                          <span class="material-symbols-outlined text-lg">download</span>
                        </a>
                        <button 
                          type="button" 
                          (click)="promptDelete(doc)"
                          class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border-none bg-transparent cursor-pointer"
                          title="Delete Document">
                          <span class="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="p-4 border-t border-[#DCEBE7]">
            <app-workora-pagination
              [pageNumber]="pageIndex()"
              [totalPages]="totalPages()"
              [totalCount]="totalDocuments()"
              [pageSize]="pageSize"
              (pageChange)="onPageChange($event)"
            ></app-workora-pagination>
          </div>
        }
      </div>

      <!-- Upload Modal -->
      @if (isUploadModalOpen()) {
        <div class="workora-modal-overlay" (click)="isUploadModalOpen.set(false)">
          <div class="workora-modal-card max-w-md" (click)="$event.stopPropagation()">
            <div class="workora-modal-header">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68] flex items-center justify-center font-bold">
                  <span class="material-symbols-outlined">upload_file</span>
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-[#063B39] font-heading">Upload Document</h3>
                  <p class="text-xs text-slate-500">Add official record or compliance attachment.</p>
                </div>
              </div>
              <button (click)="isUploadModalOpen.set(false)" class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer">
                <span class="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form [formGroup]="uploadForm" (ngSubmit)="onSaveDocument()" class="flex flex-col flex-1 overflow-hidden">
              <div class="workora-modal-body space-y-4">
                <div>
                  <label class="workora-label">Document Title <span class="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    formControlName="title" 
                    placeholder="Document Title"
                    class="workora-input !py-2.5"
                  />
                </div>

                <div>
                  <label class="workora-label">Category <span class="text-rose-500">*</span></label>
                  <select 
                    formControlName="category"
                    class="workora-select">
                    <option value="Policy">Policy</option>
                    <option value="Contract">Contract</option>
                    <option value="Identification">Identification</option>
                    <option value="TaxForm">Tax Form</option>
                    <option value="Certification">Certification</option>
                  </select>
                </div>

                <div>
                  <label class="workora-label">File Storage URL / Cloudinary Link <span class="text-rose-500">*</span></label>
                  <input 
                    type="url" 
                    formControlName="filePath" 
                    placeholder="https://res.cloudinary.com/..."
                    class="workora-input !py-2.5"
                  />
                </div>
              </div>

              <div class="workora-modal-footer">
                <button type="button" (click)="isUploadModalOpen.set(false)" class="workora-btn-secondary">
                  Cancel
                </button>
                <button type="submit" [disabled]="uploadForm.invalid || isSubmitting()" class="workora-btn-primary">
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Confirm Dialog -->
      @if (confirmDialogState(); as dialog) {
        <app-workora-confirm-dialog
          [isOpen]="true"
          [title]="dialog.title"
          [message]="dialog.message"
          confirmText="Delete"
          variant="danger"
          (confirm)="dialog.onConfirm()"
          (cancel)="confirmDialogState.set(null)"
        ></app-workora-confirm-dialog>
      }

    </div>
  `
})
export class DocumentsPageComponent implements OnInit {
  private readonly docRepo = inject(DocumentApiRepository);
  private readonly notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly documents = signal<DocumentItem[]>([]);
  readonly totalDocuments = signal<number>(0);
  readonly pageIndex = signal<number>(1);
  readonly totalPages = signal<number>(1);
  readonly isLoading = signal<boolean>(false);
  readonly pageSize = 10;

  searchTerm = '';
  selectedCategory?: string;

  readonly isUploadModalOpen = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);

  readonly confirmDialogState = signal<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  readonly uploadForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    category: ['Policy', [Validators.required]],
    filePath: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.isLoading.set(true);
    this.docRepo.getDocuments({
      pageNumber: this.pageIndex(),
      pageSize: this.pageSize,
      searchTerm: this.searchTerm || undefined,
      category: this.selectedCategory
    })
    .pipe(finalize(() => this.isLoading.set(false)))
    .subscribe({
      next: paged => {
        this.documents.set(paged.items);
        this.totalDocuments.set(paged.totalCount);
        this.totalPages.set(paged.totalPages);
      },
      error: err => this.notificationService.showError(err.message || 'Failed to load documents.')
    });
  }

  onSearch(): void {
    this.pageIndex.set(1);
    this.loadDocuments();
  }

  onCategoryChange(): void {
    this.pageIndex.set(1);
    this.loadDocuments();
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
    this.loadDocuments();
  }

  openUploadModal(): void {
    this.uploadForm.reset({ category: 'Policy' });
    this.isUploadModalOpen.set(true);
  }

  onSaveDocument(): void {
    if (this.uploadForm.invalid) return;
    const v = this.uploadForm.value;

    this.isSubmitting.set(true);
    this.docRepo.createDocument({
      companyId: 1,
      title: v.title,
      fileName: `${v.title.toLowerCase().replace(/\\s+/g, '-')}.pdf`,
      filePath: v.filePath,
      contentType: 'application/pdf',
      fileSizeBytes: 1048576,
      category: v.category
    })
    .pipe(finalize(() => this.isSubmitting.set(false)))
    .subscribe({
      next: () => {
        this.isUploadModalOpen.set(false);
        this.notificationService.showSuccess('Document record saved successfully.');
        this.loadDocuments();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to save document.')
    });
  }

  promptDelete(doc: DocumentItem): void {
    this.confirmDialogState.set({
      title: `Delete Document: ${doc.title}`,
      message: `Are you sure you want to permanently delete "${doc.title}"?`,
      onConfirm: () => {
        this.docRepo.deleteDocument(doc.id).subscribe({
          next: () => {
            this.confirmDialogState.set(null);
            this.notificationService.showSuccess('Document deleted.');
            this.loadDocuments();
          },
          error: err => this.notificationService.showError(err.message || 'Failed to delete document.')
        });
      }
    });
  }
}
