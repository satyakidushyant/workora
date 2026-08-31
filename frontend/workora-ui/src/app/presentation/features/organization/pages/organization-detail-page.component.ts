import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { SuperAdminApiRepository } from '../../../../data/repositories/superadmin-api.repository';
import { OrganizationApiRepository } from '../../../../data/repositories/organization-api.repository';
import { EmployeeApiRepository } from '../../../../data/repositories/employee-api.repository';
import { TenantOrganization, SubscriptionPlan } from '../../../../domain/models/superadmin.model';
import { Branch, Department, Designation } from '../../../../domain/models/organization.model';
import { Employee } from '../../../../domain/models/employee.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { WorkoraConfirmDialogComponent } from '../../../shared/components/workora-confirm-dialog.component';
import { WorkoraSelectComponent } from '../../../shared/components/workora-select.component';
import { IndianAddressFormComponent } from '../../../shared/components/indian-address-form.component';

type DetailTab = 'overview' | 'branches' | 'employees' | 'subscription' | 'settings';

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
    IndianAddressFormComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Back Navigation & Breadcrumb -->
      <div class="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <a routerLink="/organization" class="hover:text-[#0E6E68] transition-colors flex items-center gap-1 text-decoration-none">
          <span class="material-symbols-outlined text-sm">arrow_back</span>
          <span>Organizations</span>
        </a>
        <span>/</span>
        <span class="text-[#063B39] font-bold">{{ organization()?.name || 'Organization Details' }}</span>
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
        <div class="workora-card p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-white via-white to-[#F4F8F7]">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            
            <div class="flex items-start sm:items-center gap-4 sm:gap-5">
              <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#063B39] to-[#0E6E68] text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                {{ organization()!.code ? organization()!.code.substring(0, 2).toUpperCase() : 'OR' }}
              </div>

              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2.5">
                  <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
                    {{ organization()!.name }}
                  </h1>
                  <span 
                    [ngClass]="organization()!.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border inline-flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="organization()!.isActive ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                    <span>{{ organization()!.isActive ? 'Active Enterprise' : 'Suspended' }}</span>
                  </span>
                </div>

                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                  <span class="font-mono font-bold text-[#0E6E68]">Code: {{ organization()!.code }}</span>
                  <span>•</span>
                  <span>{{ organization()!.industry || 'Information Technology' }}</span>
                  <span>•</span>
                  <span class="text-slate-600 font-mono">{{ organization()!.email || 'No email' }}</span>
                </div>
              </div>
            </div>

            <!-- Quick Action Buttons -->
            <div class="flex flex-wrap items-center gap-2.5">
              <button 
                type="button" 
                (click)="openAddBranchModal()"
                class="workora-btn-primary text-xs shadow-md">
                <span class="material-symbols-outlined text-base">add_location_alt</span>
                <span>Add Branch</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs Switcher -->
        <div class="flex items-center p-1.5 bg-white border border-[#DCEBE7] rounded-2xl shadow-2xs overflow-x-auto">
          <button 
            type="button" 
            (click)="activeTab.set('overview')"
            [ngClass]="activeTab() === 'overview' ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-slate-600 hover:text-[#063B39]'"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none bg-transparent whitespace-nowrap">
            <span class="material-symbols-outlined text-base">dashboard</span>
            <span>Overview</span>
          </button>

          <button 
            type="button" 
            (click)="activeTab.set('branches')"
            [ngClass]="activeTab() === 'branches' ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-slate-600 hover:text-[#063B39]'"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none bg-transparent whitespace-nowrap">
            <span class="material-symbols-outlined text-base">location_city</span>
            <span>Branches</span>
            <span [ngClass]="activeTab() === 'branches' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'" class="px-2 py-0.5 rounded-md text-[10px] font-extrabold">
              {{ branches().length }}
            </span>
          </button>

          <button 
            type="button" 
            (click)="activeTab.set('employees')"
            [ngClass]="activeTab() === 'employees' ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-slate-600 hover:text-[#063B39]'"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none bg-transparent whitespace-nowrap">
            <span class="material-symbols-outlined text-base">badge</span>
            <span>Employees</span>
            <span [ngClass]="activeTab() === 'employees' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'" class="px-2 py-0.5 rounded-md text-[10px] font-extrabold">
              {{ employees().length }}
            </span>
          </button>

          <button 
            type="button" 
            (click)="activeTab.set('subscription')"
            [ngClass]="activeTab() === 'subscription' ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-slate-600 hover:text-[#063B39]'"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none bg-transparent whitespace-nowrap">
            <span class="material-symbols-outlined text-base">stars</span>
            <span>Subscription</span>
          </button>

          <button 
            type="button" 
            (click)="activeTab.set('settings')"
            [ngClass]="activeTab() === 'settings' ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-slate-600 hover:text-[#063B39]'"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none bg-transparent whitespace-nowrap">
            <span class="material-symbols-outlined text-base">tune</span>
            <span>Settings</span>
          </button>
        </div>

        <!-- ========================================================================= -->
        <!-- TAB 1: OVERVIEW                                                           -->
        <!-- ========================================================================= -->
        @if (activeTab() === 'overview') {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <!-- Left 2 Cols: Corporate Details -->
            <div class="lg:col-span-2 space-y-6">
              
              <!-- Metric Stat Pills -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="workora-card p-4 space-y-1">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Branches</span>
                  <p class="text-2xl font-extrabold text-[#063B39] font-heading">{{ branches().length }}</p>
                  <p class="text-[11px] text-[#0E6E68] font-semibold">1 Head Office</p>
                </div>

                <div class="workora-card p-4 space-y-1">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Employees</span>
                  <p class="text-2xl font-extrabold text-[#063B39] font-heading">{{ employees().length }}</p>
                  <p class="text-[11px] text-slate-500 font-medium">Headcount total</p>
                </div>

                <div class="workora-card p-4 space-y-1">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">SaaS Plan Tier</span>
                  <p class="text-2xl font-extrabold text-purple-700 font-heading">{{ organization()!.subscriptionPlan || 'Growth' }}</p>
                  <p class="text-[11px] text-emerald-600 font-bold">Active License</p>
                </div>
              </div>

              <!-- Information Card -->
              <div class="workora-card p-6 space-y-5">
                <h3 class="text-sm font-extrabold text-[#063B39] font-heading border-b border-[#DCEBE7] pb-3">
                  Corporate &amp; Legal Identity
                </h3>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Legal Company Name</label>
                    <p class="text-[#063B39] font-bold mt-0.5">{{ organization()!.name }}</p>
                  </div>

                  <div>
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Corporate Code</label>
                    <p class="font-mono font-bold text-[#0E6E68] mt-0.5">{{ organization()!.code }}</p>
                  </div>

                  <div>
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">CIN / Registration No.</label>
                    <p class="font-mono text-slate-700 mt-0.5">{{ organization()!.registrationNumber || 'Not specified' }}</p>
                  </div>

                  <div>
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">GSTIN / Corporate Tax ID</label>
                    <p class="font-mono text-slate-700 mt-0.5">{{ organization()!.taxId || 'Not specified' }}</p>
                  </div>

                  <div>
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Industry Classification</label>
                    <p class="text-slate-700 font-medium mt-0.5">{{ organization()!.industry || 'Information Technology' }}</p>
                  </div>

                  <div>
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Financial Year</label>
                    <p class="text-slate-700 font-bold mt-0.5">April 1 to March 31 (Indian Standard)</p>
                  </div>
                </div>
              </div>

              <!-- Registered Address Card -->
              <div class="workora-card p-6 space-y-4">
                <h3 class="text-sm font-extrabold text-[#063B39] font-heading border-b border-[#DCEBE7] pb-3">
                  Registered Corporate Address
                </h3>
                <div class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-xl text-[#0E6E68] mt-0.5">location_on</span>
                  <div class="text-xs text-slate-700 space-y-1">
                    <p class="font-medium leading-relaxed">
                      {{ organization()!.address || 'Headquarters, Main Office Address' }}
                    </p>
                    <p class="text-[11px] text-slate-500 font-bold">Country: India (IN)</p>
                  </div>
                </div>
              </div>

            </div>

            <!-- Right 1 Col: Contact & Operations Summary -->
            <div class="space-y-6">
              <div class="workora-card p-6 space-y-4">
                <h3 class="text-sm font-extrabold text-[#063B39] font-heading border-b border-[#DCEBE7] pb-3">
                  Primary Contact Person
                </h3>

                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-[#DCEBE7] text-[#0E6E68] flex items-center justify-center font-extrabold text-sm">
                    {{ (organization()!.primaryContactName || organization()!.name).charAt(0) }}
                  </div>
                  <div>
                    <p class="text-xs font-bold text-[#063B39]">{{ organization()!.primaryContactName || organization()!.name + ' Admin' }}</p>
                    <p class="text-[10px] text-slate-500">Authorized Organization Administrator</p>
                  </div>
                </div>

                <div class="space-y-2.5 pt-2 border-t border-[#DCEBE7]/70 text-xs">
                  <div class="flex items-center gap-2 text-slate-600">
                    <span class="material-symbols-outlined text-base text-[#0E6E68]">mail</span>
                    <span class="font-mono text-[11px]">{{ organization()!.email || 'admin@company.com' }}</span>
                  </div>

                  <div class="flex items-center gap-2 text-slate-600">
                    <span class="material-symbols-outlined text-base text-[#0E6E68]">call</span>
                    <span class="font-mono text-[11px]">{{ organization()!.phone || '+91 98765 43210' }}</span>
                  </div>

                  @if (organization()!.website) {
                    <div class="flex items-center gap-2 text-slate-600">
                      <span class="material-symbols-outlined text-base text-[#0E6E68]">language</span>
                      <a [href]="organization()!.website" target="_blank" class="text-[11px] text-[#0E6E68] hover:underline">
                        {{ organization()!.website }}
                      </a>
                    </div>
                  }
                </div>
              </div>

              <!-- Quick Action Card -->
              <div class="workora-card p-5 bg-[#F4F8F7] border border-[#DCEBE7] space-y-3">
                <h4 class="text-xs font-extrabold text-[#063B39] uppercase tracking-wider">
                  Organization Hierarchy
                </h4>
                <div class="space-y-2 text-xs">
                  <div class="flex items-center justify-between py-1.5 border-b border-[#DCEBE7]">
                    <span class="text-slate-600 font-medium">Headquarters</span>
                    <span class="font-bold text-[#0E6E68]">{{ getHeadOfficeName() }}</span>
                  </div>
                  <div class="flex items-center justify-between py-1.5 border-b border-[#DCEBE7]">
                    <span class="text-slate-600 font-medium">Currency</span>
                    <span class="font-bold text-slate-800">INR (₹)</span>
                  </div>
                  <div class="flex items-center justify-between py-1.5">
                    <span class="text-slate-600 font-medium">Onboarding Status</span>
                    <span class="font-bold text-emerald-600">Configured</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        }

        <!-- ========================================================================= -->
        <!-- TAB 2: BRANCHES (ASSOCIATED BRANCHES ONLY)                                -->
        <!-- ========================================================================= -->
        @if (activeTab() === 'branches') {
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                  Office Branches &amp; Locations
                </h3>
                <p class="text-xs text-slate-500 font-medium">
                  Branches belonging strictly to {{ organization()!.name }}.
                </p>
              </div>

              <button 
                type="button" 
                (click)="openAddBranchModal()"
                class="workora-btn-primary text-xs shadow-md">
                <span class="material-symbols-outlined text-base">add_location_alt</span>
                <span>+ Add Branch</span>
              </button>
            </div>

            <div class="workora-card overflow-hidden">
              @if (branches().length === 0) {
                <div class="p-8">
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
                <table class="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr class="bg-[#F4F8F7] border-b border-[#DCEBE7] text-[11px] font-extrabold uppercase tracking-wider text-[#063B39]">
                      <th class="py-3.5 px-5">Branch Name</th>
                      <th class="py-3.5 px-4">Code</th>
                      <th class="py-3.5 px-4">Branch Type</th>
                      <th class="py-3.5 px-4">Location / Address</th>
                      <th class="py-3.5 px-4">Status</th>
                      <th class="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#DCEBE7]/70">
                    @for (branch of branches(); track branch.id) {
                      <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                        <td class="py-3.5 px-5 font-bold text-[#063B39]">
                          <div class="flex items-center gap-2.5">
                            <span class="material-symbols-outlined text-lg text-[#0E6E68]">
                              {{ branch.isHeadOffice ? 'domain' : 'location_city' }}
                            </span>
                            <span>{{ branch.name }}</span>
                          </div>
                        </td>
                        <td class="py-3.5 px-4 font-mono font-bold text-[#0E6E68]">{{ branch.code }}</td>
                        <td class="py-3.5 px-4">
                          @if (branch.isHeadOffice) {
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200">
                              Headquarters
                            </span>
                          } @else {
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              Regional Branch
                            </span>
                          }
                        </td>
                        <td class="py-3.5 px-4 text-slate-600">
                          {{ branch.address || branch.location || 'Main Office' }}
                        </td>
                        <td class="py-3.5 px-4">
                          <span 
                            [ngClass]="branch.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                            class="px-2 py-0.5 rounded-full text-[10px] font-extrabold border">
                            {{ branch.isActive ? 'Active' : 'Inactive' }}
                          </span>
                        </td>
                        <td class="py-3.5 px-5 text-right">
                          <button 
                            type="button" 
                            (click)="deleteBranch(branch)"
                            class="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors border-none bg-transparent cursor-pointer"
                            title="Delete Branch">
                            <span class="material-symbols-outlined text-base">delete</span>
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              }
            </div>
          </div>
        }

        <!-- ========================================================================= -->
        <!-- TAB 3: EMPLOYEES                                                          -->
        <!-- ========================================================================= -->
        @if (activeTab() === 'employees') {
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                  Organization Personnel
                </h3>
                <p class="text-xs text-slate-500 font-medium">
                  Employees associated with {{ organization()!.name }}.
                </p>
              </div>

              <a routerLink="/employees" class="workora-btn-primary text-xs shadow-md">
                <span class="material-symbols-outlined text-base">person_add</span>
                <span>Onboard Employee</span>
              </a>
            </div>

            <div class="workora-card overflow-hidden">
              @if (employees().length === 0) {
                <div class="p-8">
                  <app-workora-empty-state
                    icon="group_off"
                    title="No Employees Yet"
                    description="No employee records have been onboarded for this organization.">
                    <a routerLink="/employees" class="workora-btn-primary text-xs mt-2">
                      Onboard First Employee
                    </a>
                  </app-workora-empty-state>
                </div>
              } @else {
                <table class="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr class="bg-[#F4F8F7] border-b border-[#DCEBE7] text-[11px] font-extrabold uppercase tracking-wider text-[#063B39]">
                      <th class="py-3.5 px-5">Employee</th>
                      <th class="py-3.5 px-4">Code</th>
                      <th class="py-3.5 px-4">Department</th>
                      <th class="py-3.5 px-4">Branch</th>
                      <th class="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#DCEBE7]/70">
                    @for (emp of employees(); track emp.id) {
                      <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                        <td class="py-3.5 px-5 font-bold text-[#063B39]">
                          <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-full bg-[#DCEBE7] text-[#0E6E68] font-bold text-xs flex items-center justify-center">
                              {{ emp.firstName.charAt(0) }}{{ emp.lastName.charAt(0) }}
                            </div>
                            <div>
                              <div>{{ emp.fullName }}</div>
                              <div class="text-[10px] text-slate-500 font-mono">{{ emp.email }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="py-3.5 px-4 font-mono font-bold text-[#0E6E68]">{{ emp.employeeCode }}</td>
                        <td class="py-3.5 px-4 text-slate-600">{{ emp.departmentName || '-' }}</td>
                        <td class="py-3.5 px-4 text-slate-600">{{ emp.branchName || '-' }}</td>
                        <td class="py-3.5 px-4">
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              }
            </div>
          </div>
        }

        <!-- ========================================================================= -->
        <!-- TAB 4: SUBSCRIPTION                                                       -->
        <!-- ========================================================================= -->
        @if (activeTab() === 'subscription') {
          <div class="workora-card p-6 sm:p-8 space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCEBE7] pb-6">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  Current SaaS License
                </span>
                <h3 class="text-2xl font-extrabold text-[#063B39] font-heading mt-2">
                  {{ organization()!.subscriptionPlan || 'Growth Plan' }} Tier
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">
                  Includes complete Indian Payroll, Statutory Remittances, and Multi-Branch HRMS.
                </p>
              </div>

              <div class="text-right">
                <span class="text-xs text-slate-400 font-medium">Billed Monthly</span>
                <p class="text-2xl font-black text-[#063B39] font-heading">₹14,999<span class="text-xs font-normal text-slate-500"> / mo</span></p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div class="p-4 rounded-2xl bg-[#F4F8F7] border border-[#DCEBE7] space-y-1">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Employee Capacity</span>
                <p class="text-xl font-extrabold text-[#063B39]">Up to 250 Members</p>
                <p class="text-[11px] text-slate-500">{{ employees().length }} currently enrolled</p>
              </div>

              <div class="p-4 rounded-2xl bg-[#F4F8F7] border border-[#DCEBE7] space-y-1">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Branch Offices</span>
                <p class="text-xl font-extrabold text-[#063B39]">Unlimited Locations</p>
                <p class="text-[11px] text-slate-500">{{ branches().length }} active offices</p>
              </div>

              <div class="p-4 rounded-2xl bg-[#F4F8F7] border border-[#DCEBE7] space-y-1">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Compliance Modules</span>
                <p class="text-xl font-extrabold text-emerald-700">PF, ESIC, PT &amp; TDS</p>
                <p class="text-[11px] text-emerald-600 font-bold">Enabled &amp; Active</p>
              </div>
            </div>
          </div>
        }

        <!-- ========================================================================= -->
        <!-- TAB 5: SETTINGS                                                           -->
        <!-- ========================================================================= -->
        @if (activeTab() === 'settings') {
          <div class="workora-card p-6 sm:p-8 space-y-6">
            <h3 class="text-base font-extrabold text-[#063B39] font-heading border-b border-[#DCEBE7] pb-3">
              Organization System Configuration
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div class="space-y-1">
                <label class="workora-label">Default Base Currency</label>
                <input type="text" value="INR (₹) - Indian Rupee" disabled class="workora-input !py-2.5 bg-slate-50 font-bold" />
              </div>

              <div class="space-y-1">
                <label class="workora-label">Fiscal Year Starting Month</label>
                <input type="text" value="April (Month 4)" disabled class="workora-input !py-2.5 bg-slate-50 font-bold" />
              </div>

              <div class="space-y-1">
                <label class="workora-label">Standard Timezone</label>
                <input type="text" value="Asia/Kolkata (IST +05:30)" disabled class="workora-input !py-2.5 bg-slate-50 font-bold" />
              </div>

              <div class="space-y-1">
                <label class="workora-label">Multi-Tenancy Isolation Mode</label>
                <input type="text" value="Strict Tenant Scope Scoped Query" disabled class="workora-input !py-2.5 bg-slate-50 font-bold" />
              </div>
            </div>
          </div>
        }

      }

    </div>

    <!-- ========================================================================= -->
    <!-- ADD BRANCH MODAL (ORGANIZATION CONTEXT PRE-SELECTED & LOCKED)              -->
    <!-- ========================================================================= -->
    @if (showBranchModal()) {
      <div class="workora-modal-overlay" (click)="closeBranchModal()">
        <div class="workora-modal-card max-w-xl flex flex-col" (click)="$event.stopPropagation()">
          
          <div class="p-5 sm:p-6 border-b border-[#DCEBE7] flex items-center justify-between bg-[#F4F8F7] shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#063B39] to-[#0E6E68] text-white flex items-center justify-center font-extrabold shadow-sm">
                <span class="material-symbols-outlined text-xl">add_location_alt</span>
              </div>
              <div>
                <h3 class="text-base font-extrabold text-[#063B39] font-heading">
                  Add Office Branch
                </h3>
                <p class="text-xs text-slate-500">
                  Register a regional office or facility under {{ organization()!.name }}
                </p>
              </div>
            </div>

            <button 
              type="button" 
              (click)="closeBranchModal()"
              class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors border-none bg-transparent cursor-pointer">
              <span class="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          <form [formGroup]="branchForm" class="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4 bg-white custom-scrollbar">
            
            <div class="space-y-4">
              <!-- Organization Context: Read-only -->
              <div>
                <label class="workora-label">Parent Organization (Fixed Context)</label>
                <div class="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-teal-50/60 border border-teal-200 text-xs font-bold text-[#063B39]">
                  <span class="material-symbols-outlined text-base text-[#0E6E68]">domain</span>
                  <span>{{ organization()!.name }} ({{ organization()!.code }})</span>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="workora-label">Branch Name <span class="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    formControlName="name" 
                    placeholder="e.g. Surat Development Centre"
                    class="workora-input !py-2.5"
                  />
                  @if (isBranchInvalid('name')) {
                    <p class="text-[11px] text-rose-500 mt-1">Branch name is required.</p>
                  }
                </div>

                <div>
                  <label class="workora-label">Branch Code <span class="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    formControlName="code" 
                    placeholder="e.g. SURAT"
                    class="workora-input !py-2.5 uppercase font-mono"
                  />
                  @if (isBranchInvalid('code')) {
                    <p class="text-[11px] text-rose-500 mt-1">Branch code is required.</p>
                  }
                </div>

                <div class="sm:col-span-2">
                  <label class="workora-label">Location / City Area</label>
                  <input 
                    type="text" 
                    formControlName="location" 
                    placeholder="e.g. Ring Road, Surat"
                    class="workora-input !py-2.5"
                  />
                </div>
              </div>

              <!-- Indian Address -->
              <div class="pt-2">
                <h4 class="text-xs font-extrabold text-[#063B39] uppercase tracking-wider mb-2">
                  Branch Physical Address
                </h4>
                <app-indian-address-form
                  formControlName="address"
                  [required]="false">
                </app-indian-address-form>
              </div>

              <!-- Head Office Toggle -->
              <div class="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="isHeadOffice" 
                  formControlName="isHeadOffice"
                  class="w-4 h-4 rounded border-[#DCEBE7] text-[#0E6E68] focus:ring-[#0E6E68] cursor-pointer"
                />
                <label for="isHeadOffice" class="text-xs font-bold text-[#063B39] cursor-pointer">
                  Designate as Primary Headquarters Office
                </label>
              </div>
            </div>

          </form>

          <div class="p-4 sm:p-5 border-t border-[#DCEBE7] bg-[#F4F8F7] flex items-center justify-between shrink-0">
            <button 
              type="button" 
              (click)="closeBranchModal()"
              class="workora-btn-ghost text-xs">
              Cancel
            </button>

            <button 
              type="button" 
              (click)="submitBranch()"
              [disabled]="isSavingBranch()"
              class="workora-btn-primary text-xs">
              @if (isSavingBranch()) {
                <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Saving...</span>
              } @else {
                <span class="material-symbols-outlined text-base">save</span>
                <span>Create Branch</span>
              }
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class OrganizationDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly superAdminRepo = inject(SuperAdminApiRepository);
  private readonly organizationRepo = inject(OrganizationApiRepository);
  private readonly employeeRepo = inject(EmployeeApiRepository);
  private readonly notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly organization = signal<TenantOrganization | null>(null);
  readonly branches = signal<Branch[]>([]);
  readonly employees = signal<Employee[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly activeTab = signal<DetailTab>('overview');

  readonly showBranchModal = signal<boolean>(false);
  readonly isSavingBranch = signal<boolean>(false);

  readonly branchForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    code: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9_-]{2,10}$/)]],
    location: [''],
    address: [''],
    isHeadOffice: [false]
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
    this.superAdminRepo.getOrganizationById(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: org => {
          this.organization.set(org);
          this.loadBranches(org.id);
          this.loadEmployees(org.id);
        },
        error: err => {
          this.notificationService.error(err.message || 'Failed to load organization details.');
        }
      });
  }

  loadBranches(companyId: number): void {
    this.organizationRepo.getBranches({ companyId, pageSize: 50 }).subscribe({
      next: paged => this.branches.set(paged.items || []),
      error: () => this.branches.set([])
    });
  }

  loadEmployees(companyId: number): void {
    this.employeeRepo.getEmployees({ pageNumber: 1, pageSize: 50 }).subscribe({
      next: paged => {
        this.employees.set(paged.items || []);
      },
      error: () => this.employees.set([])
    });
  }

  getHeadOfficeName(): string {
    const ho = this.branches().find(b => b.isHeadOffice);
    return ho ? ho.name : (this.branches().length > 0 ? this.branches()[0].name : 'Headquarters');
  }

  openAddBranchModal(): void {
    this.branchForm.reset({
      name: '',
      code: '',
      location: '',
      address: '',
      isHeadOffice: false
    });
    this.showBranchModal.set(true);
  }

  closeBranchModal(): void {
    this.showBranchModal.set(false);
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
}
