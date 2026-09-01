import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { SuperAdminApiRepository } from '../../../../data/repositories/superadmin-api.repository';
import { OrganizationApiRepository } from '../../../../data/repositories/organization-api.repository';
import { EmployeeApiRepository } from '../../../../data/repositories/employee-api.repository';
import { USER_REPOSITORY, IUserRepository } from '../../../../domain/repositories/i-user.repository';
import { UserSummary, CreateUserParams, UpdateUserParams, AdminResetPasswordParams } from '../../../../domain/models/user.model';
import { TenantOrganization, UpdateOrganizationParams } from '../../../../domain/models/superadmin.model';
import { Company, UpdateCompanyProfileParams, Branch, Department } from '../../../../domain/models/organization.model';
import { Employee } from '../../../../domain/models/employee.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { WorkoraConfirmDialogComponent } from '../../../shared/components/workora-confirm-dialog.component';
import { WorkoraSelectComponent, WorkoraSelectOption } from '../../../shared/components/workora-select.component';
import { IndianAddressFormComponent } from '../../../shared/components/indian-address-form.component';
import { EditOrganizationModalComponent } from '../components/edit-organization-modal.component';
import { UserFormModalComponent } from '../../users/components/user-form-modal.component';
import { AdminResetPasswordModalComponent } from '../../users/components/admin-reset-password-modal.component';
import { AssignRoleModalComponent } from '../../users/components/assign-role-modal.component';

type DetailTab = 'overview' | 'branches' | 'departments' | 'employees' | 'users' | 'subscription' | 'settings';

@Component({
  selector: 'app-organization-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    WorkoraSkeletonComponent,
    WorkoraEmptyStateComponent,
    WorkoraConfirmDialogComponent,
    WorkoraSelectComponent,
    IndianAddressFormComponent,
    EditOrganizationModalComponent,
    UserFormModalComponent,
    AdminResetPasswordModalComponent,
    AssignRoleModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Top Navigation & Breadcrumb Bar -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-1.5 text-xs text-[#718686] font-medium">
          @if (authService.hasRole('SuperAdmin')) {
            <a routerLink="/organization" class="hover:text-[#087F73] transition-colors flex items-center gap-1 text-slate-500 font-semibold no-underline">
              <span class="material-symbols-outlined text-sm">arrow_back</span>
              <span>All Organizations</span>
            </a>
            <span class="text-slate-300">/</span>
          } @else {
            <a routerLink="/dashboard" class="hover:text-[#087F73] transition-colors flex items-center gap-1 text-slate-500 font-semibold no-underline">
              <span class="material-symbols-outlined text-sm">dashboard</span>
              <span>Dashboard</span>
            </a>
            <span class="text-slate-300">/</span>
          }
          <span class="text-[#102A2A] font-bold px-2 py-1 rounded-lg bg-[#DDF7F2]/50 text-[#075E58]">
            {{ organization()?.name || 'Organization Workspace' }}
          </span>
        </div>

        @if (organization()) {
          <div class="flex items-center gap-2">
            <span class="text-[11px] text-[#718686] font-medium hidden sm:inline">Tenant ID: #{{ organization()!.id }}</span>
            <span class="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:inline"></span>
            <span 
              [ngClass]="organization()!.isActive ? 'bg-[#E8F8F5] text-[#0E6E5A] border-[#16A085]/30' : 'bg-[#FDF0F0] text-[#8E2323] border-[#D64545]/30'"
              class="px-2.5 py-1 rounded-full text-[11px] font-extrabold border inline-flex items-center gap-1.5 shadow-2xs">
              <span class="w-2 h-2 rounded-full animate-pulse" [ngClass]="organization()!.isActive ? 'bg-[#16A085]' : 'bg-[#D64545]'"></span>
              <span>{{ organization()!.isActive ? 'Active Enterprise' : 'Suspended' }}</span>
            </span>
          </div>
        }
      </div>

      @if (isLoading()) {
        <div class="space-y-6">
          <app-workora-skeleton type="card" [count]="3"></app-workora-skeleton>
          <app-workora-skeleton type="table" [count]="4"></app-workora-skeleton>
        </div>
      } @else if (!organization()) {
        <app-workora-empty-state
          icon="domain_disabled"
          title="Organization Not Found"
          description="The requested organization could not be located or may have been deleted.">
          <a routerLink="/organization" class="workora-btn-primary text-xs mt-2">
            Back to Organizations List
          </a>
        </app-workora-empty-state>
      } @else {
        
        <!-- Organization Header Hero Banner -->
        <div class="workora-card relative overflow-hidden bg-gradient-to-br from-white via-[#FBFDFD] to-[#F0FAF8] border border-[#DDE9E6] shadow-sm p-6 sm:p-8">
          
          <!-- Subtle Decorative Brand Accents -->
          <div class="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-[#087F73]/10 to-[#64D8C8]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -left-24 w-60 h-60 bg-gradient-to-tr from-[#19C6A3]/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>

          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            
            <!-- Left Brand Identity -->
            <div class="flex items-start sm:items-center gap-5">
              
              <!-- Company Avatar Monogram -->
              <div class="relative group shrink-0">
                <div class="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#075E58] via-[#087F73] to-[#0E9F8E] text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-teal ring-4 ring-white">
                  {{ organization()!.code ? organization()!.code.substring(0, 2).toUpperCase() : 'OR' }}
                </div>
                <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-xs">
                  <span class="material-symbols-outlined text-sm font-bold" [ngClass]="organization()!.isActive ? 'text-[#16A085]' : 'text-[#D64545]'">
                    {{ organization()!.isActive ? 'verified' : 'block' }}
                  </span>
                </div>
              </div>

              <!-- Titles & Metadata Badges -->
              <div class="space-y-1.5 min-w-0">
                <div class="flex flex-wrap items-center gap-2.5">
                  <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#102A2A] tracking-tight font-heading truncate">
                    {{ organization()!.name }}
                  </h1>
                </div>

                <div class="flex flex-wrap items-center gap-2 text-xs font-medium">
                  <!-- Corporate Code with 1-Click Copy -->
                  <button 
                    type="button"
                    (click)="copyToClipboard(organization()!.code, 'code')"
                    title="Click to copy Corporate Code"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#DDF7F2] text-[#075E58] font-mono font-bold hover:bg-[#c9f1e9] transition-colors border border-[#087F73]/20 cursor-pointer">
                    <span class="material-symbols-outlined text-xs">content_copy</span>
                    <span>{{ organization()!.code }}</span>
                    @if (copiedField() === 'code') {
                      <span class="text-[10px] text-emerald-700 font-extrabold animate-fade-in">✓ Copied</span>
                    }
                  </button>

                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-[#405656] text-xs font-semibold border border-slate-200">
                    <span class="material-symbols-outlined text-xs text-[#718686]">category</span>
                    <span>{{ organization()!.industry || 'General Enterprise' }}</span>
                  </span>

                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                    <span class="material-symbols-outlined text-xs">stars</span>
                    <span>{{ organization()!.subscriptionPlan || 'Growth Plan' }}</span>
                  </span>

                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                    <span class="material-symbols-outlined text-xs">payments</span>
                    <span>{{ organization()!.currency || 'INR (₹)' }}</span>
                  </span>
                </div>

                <!-- Contact details subtitle -->
                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#718686] pt-1">
                  <div class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm text-[#087F73]">mail</span>
                    <a [href]="'mailto:' + (organization()!.email || '')" class="hover:underline font-mono text-[#405656]">
                      {{ organization()!.email || 'No email registered' }}
                    </a>
                  </div>
                  @if (organization()!.phone) {
                    <div class="flex items-center gap-1">
                      <span class="material-symbols-outlined text-sm text-[#087F73]">call</span>
                      <span class="font-mono text-[#405656]">{{ organization()!.phone }}</span>
                    </div>
                  }
                  @if (organization()!.website) {
                    <div class="flex items-center gap-1">
                      <span class="material-symbols-outlined text-sm text-[#087F73]">language</span>
                      <a [href]="organization()!.website" target="_blank" class="text-[#087F73] hover:underline flex items-center gap-0.5">
                        <span>{{ organization()!.website }}</span>
                        <span class="material-symbols-outlined text-[11px]">open_in_new</span>
                      </a>
                    </div>
                  }
                </div>

              </div>
            </div>

            <!-- Header Action Toolbar -->
            <div class="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#DDE9E6]/80">
              <button 
                type="button" 
                (click)="openEditOrgModal()"
                class="workora-btn-secondary text-xs shadow-2xs hover:shadow-xs flex items-center gap-1.5 !py-2.5">
                <span class="material-symbols-outlined text-base text-[#087F73]">edit_square</span>
                <span>Edit Profile</span>
              </button>

              @if (authService.hasRole('SuperAdmin')) {
                @if (organization()!.isActive) {
                  <button 
                    type="button" 
                    (click)="showSuspendConfirm.set(true)"
                    class="px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 border border-rose-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs">
                    <span class="material-symbols-outlined text-base">block</span>
                    <span>Suspend</span>
                  </button>
                } @else {
                  <button 
                    type="button" 
                    (click)="showReactivateConfirm.set(true)"
                    class="px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 border border-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs">
                    <span class="material-symbols-outlined text-base">check_circle</span>
                    <span>Reactivate</span>
                  </button>
                }
              }

              <button 
                type="button" 
                (click)="openAddBranchModal()"
                class="workora-btn-primary text-xs shadow-teal flex items-center gap-1.5 !py-2.5">
                <span class="material-symbols-outlined text-base">add_location_alt</span>
                <span>+ Add Branch</span>
              </button>
            </div>

          </div>
        </div>

        <!-- Navigation Segmented Tabs -->
        <div class="flex items-center p-1.5 bg-white border border-[#DDE9E6] rounded-2xl shadow-2xs overflow-x-auto gap-1.5">
          
          <!-- Overview Tab -->
          <button 
            type="button" 
            (click)="activeTab.set('overview')"
            [ngClass]="activeTab() === 'overview' 
              ? 'bg-[#087F73] text-white font-extrabold shadow-sm ring-1 ring-[#087F73]' 
              : 'text-[#405656] hover:text-[#087F73] hover:bg-[#F0FAF8] font-semibold'"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer border-0 outline-none whitespace-nowrap">
            <span class="material-symbols-outlined text-base" [class.text-white]="activeTab() === 'overview'" [class.text-[#087F73]]="activeTab() !== 'overview'">
              dashboard
            </span>
            <span>Overview</span>
          </button>

          <!-- Branches Tab -->
          <button 
            type="button" 
            (click)="activeTab.set('branches')"
            [ngClass]="activeTab() === 'branches' 
              ? 'bg-[#087F73] text-white font-extrabold shadow-sm ring-1 ring-[#087F73]' 
              : 'text-[#405656] hover:text-[#087F73] hover:bg-[#F0FAF8] font-semibold'"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer border-0 outline-none whitespace-nowrap">
            <span class="material-symbols-outlined text-base" [class.text-white]="activeTab() === 'branches'" [class.text-[#087F73]]="activeTab() !== 'branches'">
              location_city
            </span>
            <span>Branches</span>
            <span 
              [ngClass]="activeTab() === 'branches' ? 'bg-white/25 text-white' : 'bg-[#DDF7F2] text-[#075E58]'" 
              class="px-2 py-0.5 rounded-full text-[10px] font-extrabold">
              {{ branches().length }}
            </span>
          </button>

          <!-- Departments Tab -->
          <button 
            type="button" 
            (click)="activeTab.set('departments')"
            [ngClass]="activeTab() === 'departments' 
              ? 'bg-[#087F73] text-white font-extrabold shadow-sm ring-1 ring-[#087F73]' 
              : 'text-[#405656] hover:text-[#087F73] hover:bg-[#F0FAF8] font-semibold'"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer border-0 outline-none whitespace-nowrap">
            <span class="material-symbols-outlined text-base" [class.text-white]="activeTab() === 'departments'" [class.text-[#087F73]]="activeTab() !== 'departments'">
              account_tree
            </span>
            <span>Departments</span>
            <span 
              [ngClass]="activeTab() === 'departments' ? 'bg-white/25 text-white' : 'bg-[#DDF7F2] text-[#075E58]'" 
              class="px-2 py-0.5 rounded-full text-[10px] font-extrabold">
              {{ departments().length }}
            </span>
          </button>

          <!-- Personnel & Staff Tab -->
          <button 
            type="button" 
            (click)="activeTab.set('employees')"
            [ngClass]="activeTab() === 'employees' 
              ? 'bg-[#087F73] text-white font-extrabold shadow-sm ring-1 ring-[#087F73]' 
              : 'text-[#405656] hover:text-[#087F73] hover:bg-[#F0FAF8] font-semibold'"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer border-0 outline-none whitespace-nowrap">
            <span class="material-symbols-outlined text-base" [class.text-white]="activeTab() === 'employees'" [class.text-[#087F73]]="activeTab() !== 'employees'">
              badge
            </span>
            <span>Personnel &amp; Staff</span>
            <span 
              [ngClass]="activeTab() === 'employees' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-700'" 
              class="px-2 py-0.5 rounded-full text-[10px] font-extrabold">
              {{ employees().length }}
            </span>
          </button>

          <!-- Team & User Logins Tab -->
          <button 
            type="button" 
            (click)="activeTab.set('users')"
            [ngClass]="activeTab() === 'users' 
              ? 'bg-[#087F73] text-white font-extrabold shadow-sm ring-1 ring-[#087F73]' 
              : 'text-[#405656] hover:text-[#087F73] hover:bg-[#F0FAF8] font-semibold'"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer border-0 outline-none whitespace-nowrap">
            <span class="material-symbols-outlined text-base" [class.text-white]="activeTab() === 'users'" [class.text-[#087F73]]="activeTab() !== 'users'">
              group
            </span>
            <span>Team &amp; Logins</span>
            <span 
              [ngClass]="activeTab() === 'users' ? 'bg-white/25 text-white' : 'bg-[#DDF7F2] text-[#075E58]'" 
              class="px-2 py-0.5 rounded-full text-[10px] font-extrabold">
              {{ companyUsers().length }}
            </span>
          </button>


          <!-- SaaS Subscription Tab -->
          <button 
            type="button" 
            (click)="activeTab.set('subscription')"
            [ngClass]="activeTab() === 'subscription' 
              ? 'bg-[#087F73] text-white font-extrabold shadow-sm ring-1 ring-[#087F73]' 
              : 'text-[#405656] hover:text-[#087F73] hover:bg-[#F0FAF8] font-semibold'"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer border-0 outline-none whitespace-nowrap">
            <span class="material-symbols-outlined text-base" [class.text-white]="activeTab() === 'subscription'" [class.text-[#087F73]]="activeTab() !== 'subscription'">
              stars
            </span>
            <span>SaaS Subscription</span>
          </button>

          <!-- System Config Tab -->
          <button 
            type="button" 
            (click)="activeTab.set('settings')"
            [ngClass]="activeTab() === 'settings' 
              ? 'bg-[#087F73] text-white font-extrabold shadow-sm ring-1 ring-[#087F73]' 
              : 'text-[#405656] hover:text-[#087F73] hover:bg-[#F0FAF8] font-semibold'"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer border-0 outline-none whitespace-nowrap">
            <span class="material-symbols-outlined text-base" [class.text-white]="activeTab() === 'settings'" [class.text-[#087F73]]="activeTab() !== 'settings'">
              tune
            </span>
            <span>System Config</span>
          </button>
        </div>

        <!-- ========================================================================= -->
        <!-- TAB 1: OVERVIEW                                                           -->
        <!-- ========================================================================= -->
        @if (activeTab() === 'overview') {
          <div class="space-y-6">
            
            <!-- 4 Metric Stat Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <!-- Total Branches -->
              <div class="workora-card p-5 relative overflow-hidden bg-white hover:border-[#087F73]/40 hover:shadow-sm transition-all group">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">Total Branches</span>
                  <div class="w-9 h-9 rounded-2xl bg-[#DDF7F2] text-[#087F73] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-lg">location_city</span>
                  </div>
                </div>
                <div class="text-3xl font-extrabold text-[#102A2A] font-heading">{{ branches().length }}</div>
                <div class="text-xs text-[#087F73] font-semibold mt-1 flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">home_work</span>
                  <span>{{ getHeadOfficeName() }}</span>
                </div>
              </div>

              <!-- Total Departments -->
              <div class="workora-card p-5 relative overflow-hidden bg-white hover:border-[#087F73]/40 hover:shadow-sm transition-all group">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">Departments</span>
                  <div class="w-9 h-9 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-lg">account_tree</span>
                  </div>
                </div>
                <div class="text-3xl font-extrabold text-[#102A2A] font-heading">{{ departments().length }}</div>
                <div class="text-xs text-teal-700 font-semibold mt-1 flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">domain</span>
                  <span>Functional units</span>
                </div>
              </div>

              <!-- Enrolled Personnel -->
              <div class="workora-card p-5 relative overflow-hidden bg-white hover:border-[#087F73]/40 hover:shadow-sm transition-all group">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">Enrolled Personnel</span>
                  <div class="w-9 h-9 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-lg">group</span>
                  </div>
                </div>
                <div class="text-3xl font-extrabold text-blue-700 font-heading">{{ employees().length }}</div>
                <div class="text-xs text-[#718686] font-medium mt-1">Active tenant employees</div>
              </div>

              <!-- SaaS Plan Tier -->
              <div class="workora-card p-5 relative overflow-hidden bg-white hover:border-[#087F73]/40 hover:shadow-sm transition-all group">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-[#718686]">SaaS Plan Tier</span>
                  <div class="w-9 h-9 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-lg">stars</span>
                  </div>
                </div>
                <div class="text-2xl font-extrabold text-purple-700 font-heading">{{ organization()!.subscriptionPlan || 'Growth' }}</div>
                <div class="text-xs text-emerald-600 font-bold mt-1">₹14,999 / mo Active</div>
              </div>

            </div>

            <!-- Main 2-Column Content Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <!-- Left 2 Cols: Identity & Registered Address -->
              <div class="lg:col-span-2 space-y-6">
                
                <!-- Corporate & Legal Identity Card -->
                <div class="workora-card p-6 space-y-5 bg-white">
                  <div class="flex items-center justify-between border-b border-[#DDE9E6] pb-3.5">
                    <div class="flex items-center gap-2.5">
                      <div class="w-8 h-8 rounded-xl bg-[#DDF7F2] text-[#087F73] flex items-center justify-center">
                        <span class="material-symbols-outlined text-lg">domain</span>
                      </div>
                      <div>
                        <h3 class="text-sm font-extrabold text-[#102A2A] font-heading">
                          Corporate &amp; Legal Identity
                        </h3>
                        <p class="text-[11px] text-[#718686]">Statutory business records and government registrations</p>
                      </div>
                    </div>

                    <button 
                      type="button" 
                      (click)="openEditOrgModal()"
                      class="text-xs font-bold text-[#087F73] hover:text-[#075E58] flex items-center gap-1 border-none bg-transparent cursor-pointer px-2.5 py-1 rounded-lg hover:bg-[#DDF7F2]/50 transition-colors">
                      <span class="material-symbols-outlined text-sm">edit</span>
                      <span>Edit Info</span>
                    </button>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                    
                    <div class="p-3.5 rounded-2xl bg-[#F6FAF9] border border-[#DDE9E6]/80 space-y-1">
                      <span class="text-[10px] font-bold uppercase tracking-wider text-[#718686]">Legal Company Name</span>
                      <p class="text-[#102A2A] font-bold text-sm">{{ organization()!.name }}</p>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-[#F6FAF9] border border-[#DDE9E6]/80 space-y-1">
                      <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-[#718686]">Corporate Code</span>
                        <button 
                          type="button"
                          (click)="copyToClipboard(organization()!.code, 'code_box')"
                          class="text-[10px] text-[#087F73] font-bold hover:underline border-none bg-transparent cursor-pointer">
                          {{ copiedField() === 'code_box' ? '✓ Copied' : 'Copy' }}
                        </button>
                      </div>
                      <p class="font-mono font-bold text-[#087F73] text-sm">{{ organization()!.code }}</p>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-[#F6FAF9] border border-[#DDE9E6]/80 space-y-1">
                      <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-[#718686]">CIN / Registration No.</span>
                        @if (organization()!.registrationNumber) {
                          <button 
                            type="button"
                            (click)="copyToClipboard(organization()!.registrationNumber!, 'cin')"
                            class="text-[10px] text-[#087F73] font-bold hover:underline border-none bg-transparent cursor-pointer">
                            {{ copiedField() === 'cin' ? '✓ Copied' : 'Copy' }}
                          </button>
                        }
                      </div>
                      <p class="font-mono font-semibold text-[#102A2A]">
                        {{ organization()!.registrationNumber || 'Not specified' }}
                      </p>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-[#F6FAF9] border border-[#DDE9E6]/80 space-y-1">
                      <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-[#718686]">GSTIN / Corporate Tax ID</span>
                        @if (organization()!.taxId) {
                          <button 
                            type="button"
                            (click)="copyToClipboard(organization()!.taxId!, 'gstin')"
                            class="text-[10px] text-[#087F73] font-bold hover:underline border-none bg-transparent cursor-pointer">
                            {{ copiedField() === 'gstin' ? '✓ Copied' : 'Copy' }}
                          </button>
                        }
                      </div>
                      <p class="font-mono font-semibold text-[#102A2A]">
                        {{ organization()!.taxId || 'Not specified' }}
                      </p>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-[#F6FAF9] border border-[#DDE9E6]/80 space-y-1">
                      <span class="text-[10px] font-bold uppercase tracking-wider text-[#718686]">Industry Classification</span>
                      <p class="text-[#102A2A] font-bold">{{ organization()!.industry || 'General Enterprise' }}</p>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-[#F6FAF9] border border-[#DDE9E6]/80 space-y-1">
                      <span class="text-[10px] font-bold uppercase tracking-wider text-[#718686]">Statutory Fiscal Year</span>
                      <p class="text-[#102A2A] font-bold">April 1 to March 31 (Indian Standard)</p>
                    </div>

                  </div>
                </div>

                <!-- Registered Corporate Address Card -->
                <div class="workora-card p-6 space-y-4 bg-white">
                  <div class="flex items-center justify-between border-b border-[#DDE9E6] pb-3.5">
                    <div class="flex items-center gap-2.5">
                      <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <span class="material-symbols-outlined text-lg">pin_drop</span>
                      </div>
                      <div>
                        <h3 class="text-sm font-extrabold text-[#102A2A] font-heading">
                          Registered Corporate Address
                        </h3>
                        <p class="text-[11px] text-[#718686]">Primary headquarter location and official tax dispatch address</p>
                      </div>
                    </div>

                    <button 
                      type="button" 
                      (click)="openEditOrgModal()"
                      class="text-xs font-bold text-[#087F73] hover:text-[#075E58] flex items-center gap-1 border-none bg-transparent cursor-pointer px-2.5 py-1 rounded-lg hover:bg-[#DDF7F2]/50 transition-colors">
                      <span class="material-symbols-outlined text-sm">edit_location</span>
                      <span>Edit Address</span>
                    </button>
                  </div>

                  <div class="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#F6FAF9] to-white border border-[#DDE9E6]">
                    <div class="w-10 h-10 rounded-2xl bg-[#DDF7F2] text-[#087F73] flex items-center justify-center shrink-0 shadow-2xs">
                      <span class="material-symbols-outlined text-xl">location_on</span>
                    </div>

                    <div class="text-xs text-[#405656] space-y-2 flex-1">
                      <p class="font-bold text-[#102A2A] leading-relaxed text-sm">
                        {{ organization()!.address || 'No registered office address provided.' }}
                      </p>
                      <div class="flex flex-wrap items-center gap-2 pt-1">
                        <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-extrabold border border-emerald-200">
                          Country: India (IN)
                        </span>
                        <span class="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-extrabold border border-teal-200">
                          Enterprise Location
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <!-- Right 1 Col: Contact & Multi-Tenant Architecture Card -->
              <div class="space-y-6">
                
                <!-- Primary Contact Person Card -->
                <div class="workora-card p-6 space-y-4 bg-white">
                  <div class="flex items-center justify-between border-b border-[#DDE9E6] pb-3.5">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-lg bg-[#DDF7F2] text-[#087F73] flex items-center justify-center">
                        <span class="material-symbols-outlined text-base">person</span>
                      </div>
                      <h3 class="text-sm font-extrabold text-[#102A2A] font-heading">
                        Primary Contact Admin
                      </h3>
                    </div>
                    <button 
                      type="button" 
                      (click)="openEditOrgModal()"
                      class="text-xs font-bold text-[#087F73] hover:text-[#075E58] border-none bg-transparent cursor-pointer">
                      Edit
                    </button>
                  </div>

                  <div class="flex items-center gap-3.5 p-3 rounded-2xl bg-[#F6FAF9] border border-[#DDE9E6]">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#075E58] to-[#087F73] text-white flex items-center justify-center font-black text-lg shadow-sm">
                      {{ (organization()!.primaryContactName || organization()!.name).charAt(0) }}
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs font-extrabold text-[#102A2A] truncate">
                        {{ organization()!.primaryContactName || organization()!.name + ' Admin' }}
                      </p>
                      <p class="text-[10px] text-[#718686] font-medium">Authorized Corporate Administrator</p>
                    </div>
                  </div>

                  <div class="space-y-2.5 pt-1 text-xs">
                    <div class="flex items-center gap-2.5 text-[#405656] p-2 rounded-xl hover:bg-[#F6FAF9] transition-colors">
                      <span class="material-symbols-outlined text-base text-[#087F73]">mail</span>
                      <a [href]="'mailto:' + (organization()!.email || 'admin@company.com')" class="font-mono text-xs text-[#102A2A] hover:underline truncate">
                        {{ organization()!.email || 'admin@company.com' }}
                      </a>
                    </div>

                    @if (organization()!.phone) {
                      <div class="flex items-center gap-2.5 text-[#405656] p-2 rounded-xl hover:bg-[#F6FAF9] transition-colors">
                        <span class="material-symbols-outlined text-base text-[#087F73]">call</span>
                        <span class="font-mono text-xs text-[#102A2A]">
                          {{ organization()!.phone }}
                        </span>
                      </div>
                    }

                    @if (organization()!.website) {
                      <div class="flex items-center gap-2.5 text-[#405656] p-2 rounded-xl hover:bg-[#F6FAF9] transition-colors">
                        <span class="material-symbols-outlined text-base text-[#087F73]">language</span>
                        <a [href]="organization()!.website" target="_blank" class="text-xs text-[#087F73] hover:underline truncate flex items-center gap-1">
                          <span>{{ organization()!.website }}</span>
                          <span class="material-symbols-outlined text-[10px]">open_in_new</span>
                        </a>
                      </div>
                    }
                  </div>
                </div>

                <!-- Organization Architecture & Hierarchy Specs -->
                <div class="workora-card p-5 bg-[#F6FAF9] border border-[#DDE9E6] space-y-3.5">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-base text-[#087F73]">account_tree</span>
                    <h4 class="text-xs font-extrabold text-[#102A2A] uppercase tracking-wider">
                      Tenant Architecture
                    </h4>
                  </div>

                  <div class="space-y-2 text-xs">
                    <div class="flex items-center justify-between py-2 border-b border-[#DDE9E6]">
                      <span class="text-[#718686] font-medium">Headquarters</span>
                      <span class="font-bold text-[#087F73]">{{ getHeadOfficeName() }}</span>
                    </div>

                    <div class="flex items-center justify-between py-2 border-b border-[#DDE9E6]">
                      <span class="text-[#718686] font-medium">Base Currency</span>
                      <span class="font-bold text-[#102A2A]">{{ organization()!.currency || 'INR (₹)' }}</span>
                    </div>

                    <div class="flex items-center justify-between py-2 border-b border-[#DDE9E6]">
                      <span class="text-[#718686] font-medium">Data Isolation</span>
                      <span class="font-mono text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">Strict Tenant Scoped</span>
                    </div>

                    <div class="flex items-center justify-between py-2">
                      <span class="text-[#718686] font-medium">Provisioning State</span>
                      <span class="font-bold text-emerald-600 flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>Configured</span>
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        }

        <!-- ========================================================================= -->
        <!-- TAB 2: BRANCHES                                                           -->
        <!-- ========================================================================= -->
        @if (activeTab() === 'branches') {
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#DDE9E6]">
              <div>
                <h3 class="text-base font-extrabold text-[#102A2A] font-heading">
                  Office Branches &amp; Physical Locations
                </h3>
                <p class="text-xs text-[#718686] font-medium">
                  Showing {{ branches().length }} registered facilities strictly under {{ organization()!.name }}.
                </p>
              </div>

              <button 
                type="button" 
                (click)="openAddBranchModal()"
                class="workora-btn-primary text-xs shadow-teal flex items-center gap-1.5">
                <span class="material-symbols-outlined text-base">add_location_alt</span>
                <span>+ Add Branch</span>
              </button>
            </div>

            <div class="workora-card overflow-hidden bg-white border border-[#DDE9E6]">
              @if (branches().length === 0) {
                <div class="p-10">
                  <app-workora-empty-state
                    icon="location_off"
                    title="No Branches Found"
                    description="No branch offices have been registered for this organization yet.">
                    <button (click)="openAddBranchModal()" class="workora-btn-primary text-xs mt-2">
                      Add First Branch
                    </button>
                  </app-workora-empty-state>
                </div>
              } @else {
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr class="bg-[#F6FAF9] border-b border-[#DDE9E6] text-[11px] font-extrabold uppercase tracking-wider text-[#102A2A]">
                        <th class="py-4 px-5">Branch Name</th>
                        <th class="py-4 px-4">Code</th>
                        <th class="py-4 px-4">Branch Type</th>
                        <th class="py-4 px-4">Location / Address</th>
                        <th class="py-4 px-4">Status</th>
                        <th class="py-4 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-[#DDE9E6]/70">
                      @for (branch of branches(); track branch.id) {
                        <tr class="hover:bg-[#F6FAF9]/70 transition-colors">
                          <td class="py-4 px-5 font-bold text-[#102A2A]">
                            <div class="flex items-center gap-3">
                              <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                [ngClass]="branch.isHeadOffice ? 'bg-[#DDF7F2] text-[#087F73]' : 'bg-slate-100 text-slate-600'">
                                <span class="material-symbols-outlined text-lg">
                                  {{ branch.isHeadOffice ? 'domain' : 'location_city' }}
                                </span>
                              </div>
                              <div>
                                <div class="font-bold text-[#102A2A]">{{ branch.name }}</div>
                                <div class="text-[10px] text-[#718686] font-mono">ID: #{{ branch.id }}</div>
                              </div>
                            </div>
                          </td>
                          <td class="py-4 px-4 font-mono font-bold text-[#087F73]">{{ branch.code }}</td>
                          <td class="py-4 px-4">
                            @if (branch.isHeadOffice) {
                              <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#DDF7F2] text-[#075E58] border border-[#087F73]/30 inline-flex items-center gap-1">
                                <span class="material-symbols-outlined text-xs">star</span>
                                <span>Headquarters</span>
                              </span>
                            } @else {
                              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-[#405656] border border-slate-200">
                                Regional Branch
                              </span>
                            }
                          </td>
                          <td class="py-4 px-4 text-[#405656] max-w-xs truncate">
                            {{ branch.address || branch.location || 'Main Office' }}
                          </td>
                          <td class="py-4 px-4">
                            <span 
                              [ngClass]="branch.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                              class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border inline-flex items-center gap-1">
                              <span class="w-1.5 h-1.5 rounded-full" [ngClass]="branch.isActive ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                              <span>{{ branch.isActive ? 'Active' : 'Inactive' }}</span>
                            </span>
                          </td>
                          <td class="py-4 px-5 text-right">
                            <div class="flex items-center justify-end gap-1.5">
                              <button 
                                type="button" 
                                (click)="openEditBranchModal(branch)"
                                class="p-1.5 rounded-xl hover:bg-[#DDF7F2] text-slate-400 hover:text-[#087F73] transition-colors border-none bg-transparent cursor-pointer"
                                title="Edit Branch">
                                <span class="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button 
                                type="button" 
                                (click)="deleteBranch(branch)"
                                class="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors border-none bg-transparent cursor-pointer"
                                title="Delete Branch">
                                <span class="material-symbols-outlined text-lg">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
            </div>
          </div>
        }

        <!-- ========================================================================= -->
        <!-- TAB 3: DEPARTMENTS                                                        -->
        <!-- ========================================================================= -->
        @if (activeTab() === 'departments') {
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#DDE9E6]">
              <div>
                <h3 class="text-base font-extrabold text-[#102A2A] font-heading">
                  Departments &amp; Organizational Units
                </h3>
                <p class="text-xs text-[#718686] font-medium">
                  Showing {{ departments().length }} departments and hierarchy strictly under {{ organization()!.name }}.
                </p>
              </div>

              <button 
                type="button" 
                (click)="openAddDepartmentModal()"
                class="workora-btn-primary text-xs shadow-teal flex items-center gap-1.5">
                <span class="material-symbols-outlined text-base">add</span>
                <span>+ Add Department</span>
              </button>
            </div>

            <div class="workora-card overflow-hidden bg-white border border-[#DDE9E6]">
              @if (departments().length === 0) {
                <div class="p-10">
                  <app-workora-empty-state
                    icon="folder_off"
                    title="No Departments Created"
                    description="No departments have been set up for this organization yet. Click below to add your first department.">
                    <button (click)="openAddDepartmentModal()" class="workora-btn-primary text-xs mt-2">
                      Add First Department
                    </button>
                  </app-workora-empty-state>
                </div>
              } @else {
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr class="bg-[#F6FAF9] border-b border-[#DDE9E6] text-[11px] font-extrabold uppercase tracking-wider text-[#102A2A]">
                        <th class="py-4 px-5">Department Name</th>
                        <th class="py-4 px-4">Code</th>
                        <th class="py-4 px-4">Parent Department</th>
                        <th class="py-4 px-4 text-center">Designations</th>
                        <th class="py-4 px-4">Status</th>
                        <th class="py-4 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-[#DDE9E6]/70">
                      @for (dept of departments(); track dept.id) {
                        <tr class="hover:bg-[#F6FAF9]/70 transition-colors">
                          <td class="py-4 px-5 font-bold text-[#102A2A]">
                            <div class="flex items-center gap-3">
                              <div class="w-9 h-9 rounded-xl bg-[#DDF7F2] text-[#087F73] flex items-center justify-center font-bold text-xs shrink-0">
                                <span class="material-symbols-outlined text-lg">account_tree</span>
                              </div>
                              <div>
                                <div class="font-bold text-[#102A2A]">{{ dept.name }}</div>
                                <div class="text-[10px] text-[#718686] font-mono">ID: #{{ dept.id }}</div>
                              </div>
                            </div>
                          </td>
                          <td class="py-4 px-4 font-mono font-bold text-[#087F73]">{{ dept.code }}</td>
                          <td class="py-4 px-4">
                            @if (dept.parentDepartmentName || getParentDeptName(dept.parentDepartmentId)) {
                              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-[#075E58] border border-slate-200">
                                <span class="material-symbols-outlined text-xs text-[#087F73]">subdirectory_arrow_right</span>
                                <span>{{ dept.parentDepartmentName || getParentDeptName(dept.parentDepartmentId) }}</span>
                              </span>
                            } @else {
                              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#DDF7F2] text-[#075E58] border border-[#087F73]/20">
                                Top Level Root
                              </span>
                            }
                          </td>
                          <td class="py-4 px-4 text-center">
                            <span class="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                              {{ dept.designationsCount || 0 }}
                            </span>
                          </td>
                          <td class="py-4 px-4">
                            <span 
                              [ngClass]="dept.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                              class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border inline-flex items-center gap-1">
                              <span class="w-1.5 h-1.5 rounded-full" [ngClass]="dept.isActive ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                              <span>{{ dept.isActive ? 'Active' : 'Inactive' }}</span>
                            </span>
                          </td>
                          <td class="py-4 px-5 text-right">
                            <div class="flex items-center justify-end gap-1.5">
                              <button 
                                type="button" 
                                (click)="openEditDepartmentModal(dept)"
                                class="p-1.5 rounded-xl hover:bg-[#DDF7F2] text-slate-400 hover:text-[#087F73] transition-colors border-none bg-transparent cursor-pointer"
                                title="Edit Department">
                                <span class="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button 
                                type="button" 
                                (click)="deleteDepartment(dept)"
                                class="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors border-none bg-transparent cursor-pointer"
                                title="Delete Department">
                                <span class="material-symbols-outlined text-lg">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
            </div>
          </div>
        }

        <!-- ========================================================================= -->
        <!-- TAB 4: EMPLOYEES                                                          -->
        <!-- ========================================================================= -->
        @if (activeTab() === 'employees') {
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#DDE9E6]">
              <div>
                <h3 class="text-base font-extrabold text-[#102A2A] font-heading">
                  Organization Personnel &amp; Staff
                </h3>
                <p class="text-xs text-[#718686] font-medium">
                  Showing {{ employees().length }} employees enrolled strictly in {{ organization()!.name }}.
                </p>
              </div>

              <a routerLink="/employees" class="workora-btn-primary text-xs shadow-teal flex items-center gap-1.5 text-decoration-none">
                <span class="material-symbols-outlined text-base">person_add</span>
                <span>Onboard Employee</span>
              </a>
            </div>

            <div class="workora-card overflow-hidden bg-white border border-[#DDE9E6]">
              @if (employees().length === 0) {
                <div class="p-10">
                  <app-workora-empty-state
                    icon="group_off"
                    title="No Employees Yet"
                    description="No employee records have been onboarded for this organization.">
                    <a routerLink="/employees" class="workora-btn-primary text-xs mt-2 text-decoration-none">
                      Onboard First Employee
                    </a>
                  </app-workora-empty-state>
                </div>
              } @else {
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr class="bg-[#F6FAF9] border-b border-[#DDE9E6] text-[11px] font-extrabold uppercase tracking-wider text-[#102A2A]">
                        <th class="py-4 px-5">Employee</th>
                        <th class="py-4 px-4">Code</th>
                        <th class="py-4 px-4">Department</th>
                        <th class="py-4 px-4">Branch Location</th>
                        <th class="py-4 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-[#DDE9E6]/70">
                      @for (emp of employees(); track emp.id) {
                        <tr class="hover:bg-[#F6FAF9]/70 transition-colors">
                          <td class="py-4 px-5 font-bold text-[#102A2A]">
                             <div class="flex items-center gap-3">
                              <div class="w-9 h-9 rounded-2xl bg-[#DDF7F2] text-[#075E58] font-bold text-xs flex items-center justify-center shrink-0">
                                {{ emp.firstName.charAt(0) }}{{ emp.lastName.charAt(0) }}
                              </div>
                              <div>
                                <div class="font-bold text-[#102A2A]">{{ emp.fullName }}</div>
                                <div class="text-[10px] text-[#718686] font-mono">{{ emp.email }}</div>
                              </div>
                            </div>
                          </td>
                          <td class="py-4 px-4 font-mono font-bold text-[#087F73]">{{ emp.employeeCode }}</td>
                          <td class="py-4 px-4 text-[#405656]">
                            <span class="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                              {{ emp.departmentName || '-' }}
                            </span>
                          </td>
                          <td class="py-4 px-4 text-[#405656]">
                            <span class="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 font-medium">
                              {{ emp.branchName || '-' }}
                            </span>
                          </td>
                          <td class="py-4 px-4">
                            <span 
                              [ngClass]="emp.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                              class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border inline-flex items-center gap-1">
                              <span class="w-1.5 h-1.5 rounded-full" [ngClass]="emp.isActive ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                              <span>Active</span>
                            </span>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
            </div>
          </div>
        }

        <!-- ========================================================================= -->
        <!-- TAB 5: TENANT USERS & ADMIN LOGINS                                        -->
        <!-- ========================================================================= -->
        @if (activeTab() === 'users') {
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#DDE9E6]">
              <div>
                <h3 class="text-base font-extrabold text-[#102A2A] font-heading">
                  Tenant Administrators &amp; Login Accounts
                </h3>
                <p class="text-xs text-[#718686] font-medium">
                  User accounts with authorized security credentials for {{ organization()!.name }}.
                </p>
              </div>

              <button 
                type="button" 
                (click)="openAddUserModal()"
                class="workora-btn-primary text-xs shadow-teal flex items-center gap-1.5 !py-2.5 cursor-pointer">
                <span class="material-symbols-outlined text-base">person_add</span>
                <span>+ Add User Account</span>
              </button>
            </div>

            <div class="workora-card overflow-hidden bg-white border border-[#DDE9E6]">
              @if (isLoadingUsers()) {
                <div class="p-6">
                  <app-workora-skeleton type="table" [count]="3"></app-workora-skeleton>
                </div>
              } @else if (companyUsers().length === 0) {
                <div class="p-10">
                  <app-workora-empty-state
                    icon="manage_accounts"
                    title="No User Accounts Created"
                    description="This organization does not have any direct user logins or administrators configured yet.">
                    <button 
                      type="button" 
                      (click)="openAddUserModal()"
                      class="workora-btn-primary text-xs mt-2 cursor-pointer">
                      + Add First User Account
                    </button>
                  </app-workora-empty-state>
                </div>
              } @else {
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr class="bg-[#F6FAF9] border-b border-[#DDE9E6] text-[11px] font-extrabold uppercase tracking-wider text-[#102A2A]">
                        <th class="py-4 px-5">User Account</th>
                        <th class="py-4 px-4">Assigned Role</th>
                        <th class="py-4 px-4">Status</th>
                        <th class="py-4 px-4">Linked Staff</th>
                        <th class="py-4 px-4">Created Date</th>
                        <th class="py-4 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-[#DDE9E6]/70">
                      @for (user of companyUsers(); track user.id) {
                        <tr class="hover:bg-[#F6FAF9]/70 transition-colors">
                          <td class="py-4 px-5 font-bold text-[#102A2A]">
                            <div class="flex items-center gap-3">
                              <div class="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#0E6E68] to-[#3FA79B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                {{ getInitials(user.firstName, user.lastName) }}
                              </div>
                              <div>
                                <div class="font-bold text-[#102A2A]">{{ user.fullName }}</div>
                                <div class="text-[10px] text-[#718686] font-mono">{{ user.email }}</div>
                              </div>
                            </div>
                          </td>
                          <td class="py-4 px-4">
                            @if (user.roles && user.roles.length > 0) {
                              @for (r of user.roles; track r) {
                                <span 
                                  [ngClass]="{
                                    'bg-purple-50 text-purple-700 border-purple-200': r === 'SuperAdmin',
                                    'bg-teal-50 text-teal-800 border-teal-200': r === 'HRAdmin',
                                    'bg-blue-50 text-blue-700 border-blue-200': r === 'FinanceManager',
                                    'bg-amber-50 text-amber-700 border-amber-200': r === 'Manager',
                                    'bg-slate-50 text-slate-700 border-slate-200': r === 'Employee'
                                  }"
                                  class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border mr-1 inline-block">
                                  {{ r }}
                                </span>
                              }
                            } @else {
                              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-50 text-slate-600 border border-slate-200">
                                Employee
                              </span>
                            }
                          </td>
                          <td class="py-4 px-4">
                            <span 
                              [ngClass]="user.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'"
                              class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border inline-flex items-center gap-1">
                              <span class="w-1.5 h-1.5 rounded-full" [ngClass]="user.isActive ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                              <span>{{ user.isActive ? 'Active' : 'Inactive' }}</span>
                            </span>
                          </td>
                          <td class="py-4 px-4 text-[#405656]">
                            @if (user.employeeId) {
                              <span class="font-mono font-bold text-[#087F73]">{{ user.employeeCode || ('ID #' + user.employeeId) }}</span>
                            } @else {
                              <span class="text-[11px] text-slate-400 italic">Direct User</span>
                            }
                          </td>
                          <td class="py-4 px-4 text-slate-500 text-xs">
                            {{ user.createdAt | date:'mediumDate' }}
                          </td>
                          <td class="py-4 px-5 text-right">
                            <div class="flex items-center justify-end gap-1.5">
                              <button 
                                type="button" 
                                (click)="openUserAssignRoleModal(user)"
                                class="p-1.5 rounded-xl hover:bg-[#DDF7F2] text-slate-400 hover:text-[#087F73] transition-colors border-none bg-transparent cursor-pointer"
                                title="Assign Role">
                                <span class="material-symbols-outlined text-lg">shield_person</span>
                              </button>
                              <button 
                                type="button" 
                                (click)="openUserEditModal(user)"
                                class="p-1.5 rounded-xl hover:bg-[#DDF7F2] text-slate-400 hover:text-[#087F73] transition-colors border-none bg-transparent cursor-pointer"
                                title="Edit User">
                                <span class="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button 
                                type="button" 
                                (click)="openUserResetPasswordModal(user)"
                                class="p-1.5 rounded-xl hover:bg-[#DDF7F2] text-slate-400 hover:text-[#087F73] transition-colors border-none bg-transparent cursor-pointer"
                                title="Reset Password">
                                <span class="material-symbols-outlined text-lg">key</span>
                              </button>
                              <button 
                                type="button" 
                                (click)="toggleUserStatus(user)"
                                class="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-[#087F73] transition-colors border-none bg-transparent cursor-pointer"
                                [title]="user.isActive ? 'Deactivate' : 'Activate'">
                                <span class="material-symbols-outlined text-lg" [ngClass]="user.isActive ? 'text-amber-600' : 'text-emerald-600'">
                                  {{ user.isActive ? 'pause_circle' : 'play_circle' }}
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
            </div>
          </div>
        }


        <!-- ========================================================================= -->
        <!-- TAB 5: SUBSCRIPTION                                                       -->
        <!-- ========================================================================= -->
        @if (activeTab() === 'subscription') {
          <div class="workora-card p-6 sm:p-8 space-y-6 bg-white border border-[#DDE9E6]">
            
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE9E6] pb-6">
              <div>
                <span class="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                  Current SaaS License Tier
                </span>
                <h3 class="text-2xl font-extrabold text-[#102A2A] font-heading mt-2">
                  {{ organization()!.subscriptionPlan || 'Growth Plan' }} Tier
                </h3>
                <p class="text-xs text-[#718686] mt-0.5">
                  Includes complete Indian Payroll, Statutory Remittances, and Multi-Branch HRMS.
                </p>
              </div>

              <div class="text-right p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
                <span class="text-[10px] text-purple-600 font-bold uppercase tracking-wider">Billed Monthly</span>
                <p class="text-2xl font-black text-purple-900 font-heading">₹14,999<span class="text-xs font-normal text-slate-500"> / mo</span></p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div class="p-5 rounded-2xl bg-[#F6FAF9] border border-[#DDE9E6] space-y-1.5">
                <span class="text-[10px] font-bold uppercase tracking-wider text-[#718686]">Employee Capacity</span>
                <p class="text-xl font-extrabold text-[#102A2A]">Up to 250 Members</p>
                <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div class="bg-[#087F73] h-full rounded-full" [style.width.%]="(employees().length / 250) * 100"></div>
                </div>
                <p class="text-[11px] text-[#718686]">{{ employees().length }} / 250 enrolled ({{ ((employees().length / 250) * 100).toFixed(0) }}%)</p>
              </div>

              <div class="p-5 rounded-2xl bg-[#F6FAF9] border border-[#DDE9E6] space-y-1.5">
                <span class="text-[10px] font-bold uppercase tracking-wider text-[#718686]">Branch Offices</span>
                <p class="text-xl font-extrabold text-[#102A2A]">Unlimited Locations</p>
                <p class="text-[11px] text-[#087F73] font-semibold mt-2">{{ branches().length }} active physical offices</p>
              </div>

              <div class="p-5 rounded-2xl bg-[#F6FAF9] border border-[#DDE9E6] space-y-1.5">
                <span class="text-[10px] font-bold uppercase tracking-wider text-[#718686]">Compliance Modules</span>
                <p class="text-xl font-extrabold text-emerald-700">PF, ESIC, PT &amp; TDS</p>
                <p class="text-[11px] text-emerald-600 font-bold mt-2">✓ Automated Calculation &amp; Challans</p>
              </div>
            </div>
          </div>
        }

        <!-- ========================================================================= -->
        <!-- TAB 6: SETTINGS                                                           -->
        <!-- ========================================================================= -->
        @if (activeTab() === 'settings') {
          <div class="workora-card p-6 sm:p-8 space-y-6 bg-white border border-[#DDE9E6]">
            <div>
              <h3 class="text-base font-extrabold text-[#102A2A] font-heading border-b border-[#DDE9E6] pb-3">
                Organization System Configuration &amp; Policies
              </h3>
              <p class="text-xs text-[#718686] mt-1">Tenant environment variables, localization rules, and security bounds.</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div class="space-y-1">
                <label class="workora-label">Default Base Currency</label>
                <input type="text" [value]="organization()!.currency || 'INR (₹)'" disabled class="workora-input !py-2.5 bg-slate-50 font-bold cursor-not-allowed" />
              </div>

              <div class="space-y-1">
                <label class="workora-label">Fiscal Year Starting Month</label>
                <input type="text" [value]="'Month ' + (organization()!.fiscalYearStartMonth || 4) + ' (April Standard)'" disabled class="workora-input !py-2.5 bg-slate-50 font-bold cursor-not-allowed" />
              </div>

              <div class="space-y-1">
                <label class="workora-label">Standard Timezone</label>
                <input type="text" value="Asia/Kolkata (IST +05:30)" disabled class="workora-input !py-2.5 bg-slate-50 font-bold cursor-not-allowed" />
              </div>

              <div class="space-y-1">
                <label class="workora-label">Multi-Tenancy Isolation Mode</label>
                <input type="text" value="Strict Tenant Scope Scoped Query" disabled class="workora-input !py-2.5 bg-slate-50 font-bold cursor-not-allowed" />
              </div>
            </div>
          </div>
        }

      }

    </div>

    <!-- ========================================================================= -->
    <!-- EDIT ORGANIZATION MODAL                                                  -->
    <!-- ========================================================================= -->
    @if (showEditOrgModal()) {
      <app-edit-organization-modal
        [organization]="organization()"
        [isSubmitting]="isSavingOrg()"
        (closeModal)="closeEditOrgModal()"
        (saveOrganization)="onSaveOrganization($event)">
      </app-edit-organization-modal>
    }

    <!-- ========================================================================= -->
    <!-- SUSPEND CONFIRMATION DIALOG                                              -->
    <!-- ========================================================================= -->
    @if (showSuspendConfirm()) {
      <app-workora-confirm-dialog
        [isOpen]="true"
        title="Suspend Tenant Organization"
        [message]="'Are you sure you want to suspend access for ' + organization()?.name + '? Active users will be restricted from signing in.'"
        confirmText="Suspend Organization"
        variant="danger"
        [isLoading]="isUpdatingStatus()"
        (cancel)="showSuspendConfirm.set(false)"
        (confirm)="confirmSuspendOrganization()">
      </app-workora-confirm-dialog>
    }

    <!-- ========================================================================= -->
    <!-- REACTIVATE CONFIRMATION DIALOG                                           -->
    <!-- ========================================================================= -->
    @if (showReactivateConfirm()) {
      <app-workora-confirm-dialog
        [isOpen]="true"
        title="Reactivate Tenant Organization"
        [message]="'Reactivate ' + organization()?.name + '? Workspace access and employee permissions will be restored.'"
        confirmText="Reactivate Organization"
        variant="info"
        [isLoading]="isUpdatingStatus()"
        (cancel)="showReactivateConfirm.set(false)"
        (confirm)="confirmReactivateOrganization()">
      </app-workora-confirm-dialog>
    }


    <!-- ========================================================================= -->
    <!-- ADD / EDIT BRANCH MODAL                                                  -->
    <!-- ========================================================================= -->
    @if (showBranchModal()) {
      <div class="workora-modal-overlay" (click)="closeBranchModal()">
        <div class="workora-modal-card max-w-xl flex flex-col" (click)="$event.stopPropagation()">
          
          <div class="p-5 sm:p-6 border-b border-[#DDE9E6] flex items-center justify-between bg-gradient-to-r from-[#F6FAF9] via-white to-[#F6FAF9] shrink-0">
            <div class="flex items-center gap-3.5">
              <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#075E58] to-[#087F73] text-white flex items-center justify-center font-extrabold shadow-sm">
                <span class="material-symbols-outlined text-2xl">add_location_alt</span>
              </div>
              <div>
                <h3 class="text-base font-extrabold text-[#102A2A] font-heading">
                  {{ editingBranch() ? 'Edit Branch Office' : 'Add Office Branch' }}
                </h3>
                <p class="text-xs text-[#718686]">
                  {{ editingBranch() ? 'Update details for ' + editingBranch()!.name : 'Register a facility under ' + organization()!.name }}
                </p>
              </div>
            </div>

            <button 
              type="button" 
              (click)="closeBranchModal()"
              class="text-slate-400 hover:text-slate-600 rounded-xl p-2 transition-colors border-none bg-transparent cursor-pointer hover:bg-slate-100">
              <span class="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          <form [formGroup]="branchForm" class="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4 bg-white custom-scrollbar">
            
            <div class="space-y-4">
              <!-- Organization Context: Read-only -->
              <div>
                <label class="workora-label">Parent Organization (Fixed Context)</label>
                <div class="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#DDF7F2]/60 border border-[#087F73]/20 text-xs font-bold text-[#075E58]">
                  <span class="material-symbols-outlined text-base">domain</span>
                  <span>{{ organization()!.name }} ({{ organization()!.code }})</span>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="workora-label">Branch Name <span class="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    formControlName="name" 
                    placeholder="e.g. Headquarters Office"
                    class="workora-input !py-2.5 text-xs"
                  />
                  @if (isBranchInvalid('name')) {
                    <p class="text-[11px] text-rose-500 font-semibold mt-1">Branch name is required.</p>
                  }
                </div>

                <div>
                  <label class="workora-label">Branch Code <span class="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    formControlName="code" 
                    placeholder="e.g. BR-01"
                    class="workora-input !py-2.5 uppercase font-mono text-xs"
                  />
                  @if (isBranchInvalid('code')) {
                    <p class="text-[11px] text-rose-500 font-semibold mt-1">Branch code is required (2-10 chars).</p>
                  }
                </div>

                <div class="sm:col-span-2">
                  <label class="workora-label">Location Area</label>
                  <input 
                    type="text" 
                    formControlName="location" 
                    placeholder="e.g. SG Highway, Bodakdev"
                    class="workora-input !py-2.5 text-xs"
                  />
                </div>
              </div>

              <!-- Indian Address Form -->
              <div class="pt-2">
                <h4 class="text-xs font-extrabold text-[#102A2A] uppercase tracking-wider mb-2">
                  Branch Physical Address (Dynamic State/City)
                </h4>
                <app-indian-address-form
                  formControlName="address"
                  [required]="false">
                </app-indian-address-form>
              </div>

              <!-- Head Office Toggle -->
              <div class="flex items-center gap-3 p-3 bg-[#F6FAF9] rounded-2xl border border-[#DDE9E6] mt-2">
                <input 
                  type="checkbox" 
                  id="isHeadOffice" 
                  formControlName="isHeadOffice"
                  class="w-4 h-4 rounded border-[#DDE9E6] text-[#087F73] focus:ring-[#087F73] cursor-pointer"
                />
                <label for="isHeadOffice" class="text-xs font-bold text-[#102A2A] cursor-pointer">
                  Designate as Primary Headquarters Office
                </label>
              </div>
            </div>

          </form>

          <div class="p-4 sm:p-5 border-t border-[#DDE9E6] bg-[#F6FAF9] flex items-center justify-between shrink-0">
            <button 
              type="button" 
              (click)="closeBranchModal()"
              class="workora-btn-secondary text-xs">
              Cancel
            </button>

            <button 
              type="button" 
              (click)="submitBranch()"
              [disabled]="isSavingBranch()"
              class="workora-btn-primary text-xs shadow-teal flex items-center gap-1.5">
              @if (isSavingBranch()) {
                <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Saving Branch...</span>
              } @else {
                <span class="material-symbols-outlined text-base">save</span>
                <span>{{ editingBranch() ? 'Update Branch' : 'Create Branch' }}</span>
              }
            </button>
          </div>

        </div>
      </div>
    }

    <!-- ========================================================================= -->
    <!-- ADD / EDIT DEPARTMENT MODAL                                              -->
    <!-- ========================================================================= -->
    @if (showDepartmentModal()) {
      <div class="workora-modal-overlay" (click)="closeDepartmentModal()">
        <div class="workora-modal-card max-w-lg flex flex-col" (click)="$event.stopPropagation()">
          
          <div class="p-5 sm:p-6 border-b border-[#DDE9E6] flex items-center justify-between bg-gradient-to-r from-[#F6FAF9] via-white to-[#F6FAF9] shrink-0">
            <div class="flex items-center gap-3.5">
              <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#075E58] to-[#087F73] text-white flex items-center justify-center font-extrabold shadow-sm">
                <span class="material-symbols-outlined text-2xl">account_tree</span>
              </div>
              <div>
                <h3 class="text-base font-extrabold text-[#102A2A] font-heading">
                  {{ editingDepartment() ? 'Edit Department' : 'Add Department' }}
                </h3>
                <p class="text-xs text-[#718686]">
                  {{ editingDepartment() ? 'Update department hierarchy' : 'Configure department in ' + organization()!.name }}
                </p>
              </div>
            </div>

            <button 
              type="button" 
              (click)="closeDepartmentModal()"
              class="text-slate-400 hover:text-slate-600 rounded-xl p-2 transition-colors border-none bg-transparent cursor-pointer hover:bg-slate-100">
              <span class="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          <form [formGroup]="departmentForm" class="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4 bg-white custom-scrollbar">
            
            <div class="space-y-4">
              <!-- Organization Context: Read-only -->
              <div>
                <label class="workora-label">Parent Organization</label>
                <div class="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#DDF7F2]/60 border border-[#087F73]/20 text-xs font-bold text-[#075E58]">
                  <span class="material-symbols-outlined text-base">domain</span>
                  <span>{{ organization()!.name }} ({{ organization()!.code }})</span>
                </div>
              </div>

              <div>
                <label class="workora-label">Department Name <span class="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  formControlName="name" 
                  placeholder="e.g. Engineering & Technology"
                  class="workora-input !py-2.5 text-xs"
                />
                @if (isDepartmentInvalid('name')) {
                  <p class="text-[11px] text-rose-500 font-semibold mt-1">Department name is required.</p>
                }
              </div>

              <div>
                <label class="workora-label">Department Code <span class="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  formControlName="code" 
                  placeholder="e.g. ENG, HR, FIN"
                  class="workora-input !py-2.5 uppercase font-mono text-xs"
                />
                @if (isDepartmentInvalid('code')) {
                  <p class="text-[11px] text-rose-500 font-semibold mt-1">Department code is required (2-10 chars).</p>
                }
              </div>

              <!-- Parent Department Hierarchy Selector -->
              <div>
                <label class="workora-label">Parent Department (Hierarchical Structure)</label>
                <app-workora-select
                  formControlName="parentDepartmentId"
                  [options]="parentDepartmentOptions()"
                  [clearable]="true"
                  placeholder="Select Parent Department (Optional)"
                  icon="account_tree">
                </app-workora-select>
                <p class="text-[11px] text-[#718686] mt-1">
                  Leave empty if this is a top-level root department.
                </p>
              </div>
            </div>

          </form>

          <div class="p-4 sm:p-5 border-t border-[#DDE9E6] bg-[#F6FAF9] flex items-center justify-between shrink-0">
            <button 
              type="button" 
              (click)="closeDepartmentModal()"
              class="workora-btn-secondary text-xs">
              Cancel
            </button>

            <button 
              type="button" 
              (click)="submitDepartment()"
              [disabled]="isSavingDepartment()"
              class="workora-btn-primary text-xs shadow-teal flex items-center gap-1.5">
              @if (isSavingDepartment()) {
                <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Saving Department...</span>
              } @else {
                <span class="material-symbols-outlined text-base">save</span>
                <span>{{ editingDepartment() ? 'Update Department' : 'Create Department' }}</span>
              }
            </button>
          </div>

        </div>
      </div>
    }

    <!-- ========================================================================= -->
    <!-- ADD / EDIT USER MODAL                                                     -->
    <!-- ========================================================================= -->
    @if (showUserModal()) {
      <app-user-form-modal
        [userToEdit]="selectedUser()"
        [presetCompanyId]="organization()?.id"
        [presetCompanyName]="organization()?.name"
        [isSubmitting]="isSubmittingUserModal()"
        (save)="onSaveUser($event)"
        (cancel)="showUserModal.set(false)">
      </app-user-form-modal>
    }

    <!-- ========================================================================= -->
    <!-- ASSIGN ROLE MODAL                                                         -->
    <!-- ========================================================================= -->
    @if (showUserAssignRoleModal()) {
      <app-assign-role-modal
        [user]="selectedUser()"
        [isSubmitting]="isSubmittingUserModal()"
        (assign)="onConfirmUserAssignRole($event)"
        (cancel)="showUserAssignRoleModal.set(false)">
      </app-assign-role-modal>
    }

    <!-- ========================================================================= -->
    <!-- RESET PASSWORD MODAL                                                      -->
    <!-- ========================================================================= -->
    @if (showUserResetPasswordModal()) {
      <app-admin-reset-password-modal
        [user]="selectedUser()"
        [isSubmitting]="isSubmittingUserModal()"
        (confirm)="onConfirmUserResetPassword($event)"
        (cancel)="showUserResetPasswordModal.set(false)">
      </app-admin-reset-password-modal>
    }

  `
})
export class OrganizationDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly superAdminRepo = inject(SuperAdminApiRepository);
  private readonly organizationRepo = inject(OrganizationApiRepository);
  private readonly employeeRepo = inject(EmployeeApiRepository);
  private readonly userRepo = inject<IUserRepository>(USER_REPOSITORY);
  private readonly notificationService = inject(NotificationService);
  readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly organization = signal<TenantOrganization | null>(null);
  readonly branches = signal<Branch[]>([]);
  readonly departments = signal<Department[]>([]);
  readonly employees = signal<Employee[]>([]);
  readonly companyUsers = signal<UserSummary[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly isLoadingUsers = signal<boolean>(false);
  readonly activeTab = signal<DetailTab>('overview');
  readonly copiedField = signal<string | null>(null);

  readonly showEditOrgModal = signal<boolean>(false);
  readonly isSavingOrg = signal<boolean>(false);

  readonly showSuspendConfirm = signal<boolean>(false);
  readonly showReactivateConfirm = signal<boolean>(false);
  readonly isUpdatingStatus = signal<boolean>(false);

  // Branch Modal State
  readonly showBranchModal = signal<boolean>(false);
  readonly isSavingBranch = signal<boolean>(false);
  readonly editingBranch = signal<Branch | null>(null);

  readonly branchForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    code: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9_-]{2,10}$/)]],
    location: [''],
    address: [''],
    isHeadOffice: [false]
  });

  // Department Modal State
  readonly showDepartmentModal = signal<boolean>(false);
  readonly isSavingDepartment = signal<boolean>(false);
  readonly editingDepartment = signal<Department | null>(null);

  readonly departmentForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    code: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9_-]{2,10}$/)]],
    parentDepartmentId: [null]
  });

  // User Modal State
  readonly showUserModal = signal<boolean>(false);
  readonly showUserAssignRoleModal = signal<boolean>(false);
  readonly showUserResetPasswordModal = signal<boolean>(false);
  readonly selectedUser = signal<UserSummary | null>(null);
  readonly isSubmittingUserModal = signal<boolean>(false);

  readonly parentDepartmentOptions = computed<WorkoraSelectOption[]>(() => {
    const currentEditId = this.editingDepartment()?.id;
    return this.departments()
      .filter(d => !currentEditId || d.id !== currentEditId)
      .map(d => ({
        value: d.id,
        label: `${d.name} (${d.code})`
      }));
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadOrganization(id);
      }
    });
  }

  loadOrganization(id: number): void {
    this.isLoading.set(true);
    if (this.authService.hasRole('SuperAdmin')) {
      this.superAdminRepo.getOrganizationById(id)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: org => {
            this.organization.set(org);
            this.loadBranches(org.id);
            this.loadDepartments(org.id);
            this.loadEmployees(org.id);
            this.loadCompanyUsers(org.id);
          },
          error: () => {
            this.loadCompanyFallback(id);
          }
        });
    } else {
      this.loadCompanyFallback(id);
    }
  }

  private loadCompanyFallback(id: number): void {
    this.organizationRepo.getCompanyProfile(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (comp: Company) => {
          const org: TenantOrganization = {
            id: comp.id,
            name: comp.name,
            code: comp.code,
            industry: 'Information Technology & Software',
            registrationNumber: comp.registrationNumber,
            taxId: comp.taxId,
            email: comp.email,
            phone: comp.phone,
            website: comp.website,
            address: comp.address,
            isActive: comp.isActive ?? true,
            subscriptionPlan: 'Growth',
            employeeCount: 0,
            branchCount: 1,
            currency: comp.currency || 'INR',
            fiscalYearStartMonth: comp.fiscalYearStartMonth || 4,
            createdAt: comp.createdAt ? comp.createdAt.toString() : new Date().toISOString()
          };
          this.organization.set(org);
          this.loadBranches(org.id);
          this.loadDepartments(org.id);
          this.loadEmployees(org.id);
          this.loadCompanyUsers(org.id);
        },
        error: err => {
          this.notificationService.error(err.message || 'Failed to load organization details.');
        }
      });
  }

  loadBranches(companyId: number): void {
    this.organizationRepo.getBranches({ companyId, pageSize: 100 }).subscribe({
      next: paged => this.branches.set(paged.items || []),
      error: () => this.branches.set([])
    });
  }

  loadDepartments(companyId: number): void {
    this.organizationRepo.getDepartments({ companyId, pageSize: 100 }).subscribe({
      next: paged => this.departments.set(paged.items || []),
      error: () => this.departments.set([])
    });
  }

  loadEmployees(companyId: number): void {
    this.employeeRepo.getEmployees({ pageNumber: 1, pageSize: 100, companyId }).subscribe({
      next: paged => this.employees.set(paged.items || []),
      error: () => this.employees.set([])
    });
  }

  loadCompanyUsers(companyId: number): void {
    this.isLoadingUsers.set(true);
    this.userRepo.getUsers({ companyId, pageSize: 100 })
      .pipe(finalize(() => this.isLoadingUsers.set(false)))
      .subscribe({
        next: paged => this.companyUsers.set(paged.items || []),
        error: () => this.companyUsers.set([])
      });
  }

  // ==========================================
  // User Management
  // ==========================================

  openAddUserModal(): void {
    this.selectedUser.set(null);
    this.showUserModal.set(true);
  }

  openUserEditModal(user: UserSummary): void {
    this.selectedUser.set(user);
    this.showUserModal.set(true);
  }

  openUserAssignRoleModal(user: UserSummary): void {
    this.selectedUser.set(user);
    this.showUserAssignRoleModal.set(true);
  }

  openUserResetPasswordModal(user: UserSummary): void {
    this.selectedUser.set(user);
    this.showUserResetPasswordModal.set(true);
  }

  onSaveUser(payload: CreateUserParams | UpdateUserParams): void {
    const org = this.organization();
    if (!org) return;
    this.isSubmittingUserModal.set(true);

    if ('id' in payload) {
      this.userRepo.updateUser(payload).subscribe({
        next: updated => {
          if (payload.roleId) {
            this.userRepo.assignRoles({ userId: updated.id, roleIds: [payload.roleId] }).subscribe({
              next: () => {
                this.isSubmittingUserModal.set(false);
                this.showUserModal.set(false);
                this.notificationService.success('User updated successfully.');
                this.loadCompanyUsers(org.id);
              },
              error: () => {
                this.isSubmittingUserModal.set(false);
                this.showUserModal.set(false);
                this.loadCompanyUsers(org.id);
              }
            });
          } else {
            this.isSubmittingUserModal.set(false);
            this.showUserModal.set(false);
            this.notificationService.success('User updated successfully.');
            this.loadCompanyUsers(org.id);
          }
        },
        error: err => {
          this.isSubmittingUserModal.set(false);
          this.notificationService.error(err.message || 'Failed to update user.');
        }
      });
    } else {
      const createPayload = { ...payload, companyId: org.id } as CreateUserParams;
      this.userRepo.createUser(createPayload).subscribe({
        next: newUser => {
          this.isSubmittingUserModal.set(false);
          this.showUserModal.set(false);
          this.notificationService.success(`User "${newUser.fullName}" created for ${org.name}!`);
          this.loadCompanyUsers(org.id);
        },
        error: err => {
          this.isSubmittingUserModal.set(false);
          this.notificationService.error(err.message || 'Failed to create user account.');
        }
      });
    }
  }

  onConfirmUserAssignRole(event: { userId: number; roleId: number }): void {
    const org = this.organization();
    if (!org) return;
    this.isSubmittingUserModal.set(true);
    this.userRepo.assignRoles({ userId: event.userId, roleIds: [event.roleId] }).subscribe({
      next: () => {
        this.isSubmittingUserModal.set(false);
        this.showUserAssignRoleModal.set(false);
        this.notificationService.success('Role updated.');
        this.loadCompanyUsers(org.id);
      },
      error: err => {
        this.isSubmittingUserModal.set(false);
        this.notificationService.error(err.message || 'Failed to assign role.');
      }
    });
  }

  onConfirmUserResetPassword(event: AdminResetPasswordParams): void {
    this.isSubmittingUserModal.set(true);
    this.userRepo.adminResetPassword(event).subscribe({
      next: () => {
        this.isSubmittingUserModal.set(false);
        this.showUserResetPasswordModal.set(false);
        this.notificationService.success('Password reset successfully.');
      },
      error: err => {
        this.isSubmittingUserModal.set(false);
        this.notificationService.error(err.message || 'Failed to reset password.');
      }
    });
  }

  toggleUserStatus(user: UserSummary): void {
    const org = this.organization();
    if (!org) return;
    const action$ = user.isActive ? this.userRepo.deactivateUser(user.id) : this.userRepo.activateUser(user.id);
    action$.subscribe({
      next: () => {
        this.notificationService.success(`User account ${user.isActive ? 'deactivated' : 'activated'}.`);
        this.loadCompanyUsers(org.id);
      },
      error: err => {
        this.notificationService.error(err.message || 'Failed to toggle status.');
      }
    });
  }

  getParentDeptName(parentId: number | null | undefined): string | null {
    if (!parentId) return null;
    const parent = this.departments().find(d => d.id === parentId);
    return parent ? parent.name : null;
  }

  getHeadOfficeName(): string {
    const ho = this.branches().find(b => b.isHeadOffice);
    return ho ? ho.name : (this.branches().length > 0 ? this.branches()[0].name : 'No Headquarters Configured');
  }

  copyToClipboard(text: string, field: string): void {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.copiedField.set(field);
      setTimeout(() => {
        if (this.copiedField() === field) {
          this.copiedField.set(null);
        }
      }, 2000);
    });
  }

  openEditOrgModal(): void {
    this.showEditOrgModal.set(true);
  }

  closeEditOrgModal(): void {
    this.showEditOrgModal.set(false);
  }

  onSaveOrganization(params: UpdateOrganizationParams): void {
    this.isSavingOrg.set(true);
    if (this.authService.hasRole('SuperAdmin')) {
      this.superAdminRepo.updateOrganization(params.id, params)
        .pipe(finalize(() => this.isSavingOrg.set(false)))
        .subscribe({
          next: updated => {
            this.notificationService.success(`Organization profile for "${updated.name}" updated successfully.`);
            this.organization.set({
              ...this.organization()!,
              ...updated,
              industry: params.industry || this.organization()?.industry,
              primaryContactName: params.primaryContactName || this.organization()?.primaryContactName
            });
            this.closeEditOrgModal();
          },
          error: () => {
            this.saveCompanyFallback(params);
          }
        });
    } else {
      this.saveCompanyFallback(params);
    }
  }

  private saveCompanyFallback(params: UpdateOrganizationParams): void {
    const updateParams: UpdateCompanyProfileParams = {
      id: params.id,
      name: params.name,
      registrationNumber: params.registrationNumber,
      taxId: params.taxId,
      email: params.email,
      phone: params.phone,
      website: params.website,
      fiscalYearStartMonth: params.fiscalYearStartMonth ?? 4,
      currency: params.currency || 'INR',
      address: params.address
    };

    this.organizationRepo.updateCompanyProfile(updateParams)
      .pipe(finalize(() => this.isSavingOrg.set(false)))
      .subscribe({
        next: comp => {
          this.notificationService.success(`Organization profile for "${comp.name}" updated successfully.`);
          this.organization.update(curr => curr ? ({
            ...curr,
            name: comp.name,
            registrationNumber: comp.registrationNumber,
            taxId: comp.taxId,
            email: comp.email,
            phone: comp.phone,
            website: comp.website,
            address: comp.address,
            fiscalYearStartMonth: comp.fiscalYearStartMonth || curr.fiscalYearStartMonth,
            currency: comp.currency || curr.currency,
            industry: params.industry || curr.industry,
            primaryContactName: params.primaryContactName || curr.primaryContactName
          }) : null);
          this.closeEditOrgModal();
        },
        error: err => {
          this.notificationService.error(err.message || 'Failed to update organization profile.');
        }
      });
  }

  confirmSuspendOrganization(): void {
    const org = this.organization();
    if (!org) return;

    this.isUpdatingStatus.set(true);
    this.superAdminRepo.suspendOrganization(org.id)
      .pipe(finalize(() => {
        this.isUpdatingStatus.set(false);
        this.showSuspendConfirm.set(false);
      }))
      .subscribe({
        next: () => {
          this.notificationService.success(`Organization "${org.name}" has been suspended.`);
          this.loadOrganization(org.id);
        },
        error: err => {
          this.notificationService.error(err.message || 'Failed to suspend organization.');
        }
      });
  }

  confirmReactivateOrganization(): void {
    const org = this.organization();
    if (!org) return;

    this.isUpdatingStatus.set(true);
    this.superAdminRepo.reactivateOrganization(org.id)
      .pipe(finalize(() => {
        this.isUpdatingStatus.set(false);
        this.showReactivateConfirm.set(false);
      }))
      .subscribe({
        next: () => {
          this.notificationService.success(`Organization "${org.name}" reactivated successfully.`);
          this.loadOrganization(org.id);
        },
        error: err => {
          this.notificationService.error(err.message || 'Failed to reactivate organization.');
        }
      });
  }

  // ==========================================
  // Branch Management
  // ==========================================

  openAddBranchModal(): void {
    this.editingBranch.set(null);
    this.branchForm.reset({
      name: '',
      code: '',
      location: '',
      address: '',
      isHeadOffice: false
    });
    this.showBranchModal.set(true);
  }

  openEditBranchModal(branch: Branch): void {
    this.editingBranch.set(branch);
    this.branchForm.reset({
      name: branch.name,
      code: branch.code,
      location: branch.location,
      address: branch.address || '',
      isHeadOffice: branch.isHeadOffice
    });
    this.showBranchModal.set(true);
  }

  closeBranchModal(): void {
    this.showBranchModal.set(false);
    this.editingBranch.set(null);
  }

  isBranchInvalid(controlName: string): boolean {
    const control = this.branchForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  submitBranch(): void {
    if (this.branchForm.invalid) {
      this.branchForm.markAllAsTouched();
      return;
    }

    const org = this.organization();
    if (!org) return;

    this.isSavingBranch.set(true);
    const val = this.branchForm.value;
    const editing = this.editingBranch();

    if (editing) {
      this.organizationRepo.updateBranch({
        id: editing.id,
        name: val.name.trim(),
        code: val.code.trim().toUpperCase(),
        location: val.location ? val.location.trim() : 'Main Office',
        address: val.address || null,
        timezone: 'Asia/Kolkata',
        isHeadOffice: !!val.isHeadOffice
      })
      .pipe(finalize(() => this.isSavingBranch.set(false)))
      .subscribe({
        next: updated => {
          this.notificationService.success(`Branch "${updated.name}" updated successfully.`);
          this.closeBranchModal();
          this.loadBranches(org.id);
        },
        error: err => {
          this.notificationService.error(err.message || 'Failed to update branch.');
        }
      });
    } else {
      this.organizationRepo.createBranch({
        companyId: org.id,
        name: val.name.trim(),
        code: val.code.trim().toUpperCase(),
        location: val.location ? val.location.trim() : 'Main Office',
        address: val.address || null,
        timezone: 'Asia/Kolkata',
        isHeadOffice: !!val.isHeadOffice
      })
      .pipe(finalize(() => this.isSavingBranch.set(false)))
      .subscribe({
        next: created => {
          this.notificationService.success(`Branch "${created.name}" created successfully for ${org.name}.`);
          this.closeBranchModal();
          this.loadBranches(org.id);
        },
        error: err => {
          this.notificationService.error(err.message || 'Failed to create branch.');
        }
      });
    }
  }

  deleteBranch(branch: Branch): void {
    const org = this.organization();
    if (!org) return;

    this.organizationRepo.deleteBranch(branch.id).subscribe({
      next: () => {
        this.notificationService.success(`Branch "${branch.name}" removed.`);
        this.loadBranches(org.id);
      },
      error: err => {
        this.notificationService.error(err.message || 'Failed to delete branch.');
      }
    });
  }

  // ==========================================
  // Department Management
  // ==========================================

  openAddDepartmentModal(): void {
    this.editingDepartment.set(null);
    this.departmentForm.reset({
      name: '',
      code: '',
      parentDepartmentId: null
    });
    this.showDepartmentModal.set(true);
  }

  openEditDepartmentModal(dept: Department): void {
    this.editingDepartment.set(dept);
    this.departmentForm.reset({
      name: dept.name,
      code: dept.code,
      parentDepartmentId: dept.parentDepartmentId || null
    });
    this.showDepartmentModal.set(true);
  }

  closeDepartmentModal(): void {
    this.showDepartmentModal.set(false);
    this.editingDepartment.set(null);
  }

  isDepartmentInvalid(controlName: string): boolean {
    const control = this.departmentForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  submitDepartment(): void {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    const org = this.organization();
    if (!org) return;

    this.isSavingDepartment.set(true);
    const val = this.departmentForm.value;
    const editing = this.editingDepartment();

    if (editing) {
      this.organizationRepo.updateDepartment({
        id: editing.id,
        code: val.code.trim().toUpperCase(),
        name: val.name.trim(),
        headEmployeeId: null,
        parentDepartmentId: val.parentDepartmentId ? +val.parentDepartmentId : null
      })
      .pipe(finalize(() => this.isSavingDepartment.set(false)))
      .subscribe({
        next: updated => {
          this.notificationService.success(`Department "${updated.name}" updated successfully.`);
          this.closeDepartmentModal();
          this.loadDepartments(org.id);
        },
        error: err => {
          this.notificationService.error(err.message || 'Failed to update department.');
        }
      });
    } else {
      this.organizationRepo.createDepartment({
        companyId: org.id,
        code: val.code.trim().toUpperCase(),
        name: val.name.trim(),
        headEmployeeId: null,
        parentDepartmentId: val.parentDepartmentId ? +val.parentDepartmentId : null
      })
      .pipe(finalize(() => this.isSavingDepartment.set(false)))
      .subscribe({
        next: created => {
          this.notificationService.success(`Department "${created.name}" created successfully for ${org.name}.`);
          this.closeDepartmentModal();
          this.loadDepartments(org.id);
        },
        error: err => {
          this.notificationService.error(err.message || 'Failed to create department.');
        }
      });
    }
  }

  deleteDepartment(dept: Department): void {
    const org = this.organization();
    if (!org) return;

    this.organizationRepo.deleteDepartment(dept.id).subscribe({
      next: () => {
        this.notificationService.success(`Department "${dept.name}" removed.`);
        this.loadDepartments(org.id);
      },
      error: err => {
        this.notificationService.error(err.message || 'Failed to delete department.');
      }
    });
  }

  getInitials(firstName?: string, lastName?: string): string {
    const f = (firstName || '').charAt(0).toUpperCase();
    const l = (lastName || '').charAt(0).toUpperCase();
    return `${f}${l}` || 'U';
  }
}

