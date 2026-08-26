import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { OrganizationApiRepository } from '../../../../data/repositories/organization-api.repository';
import {
  Company,
  Branch,
  Department,
  Designation,
  UpdateCompanyProfileParams,
  CreateBranchParams,
  UpdateBranchParams,
  CreateDepartmentParams,
  UpdateDepartmentParams,
  CreateDesignationParams,
  UpdateDesignationParams
} from '../../../../domain/models/organization.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { WorkoraSkeletonComponent } from '../../../shared/components/workora-skeleton.component';
import { WorkoraPaginationComponent } from '../../../shared/components/workora-pagination.component';
import { WorkoraEmptyStateComponent } from '../../../shared/components/workora-empty-state.component';
import { WorkoraConfirmDialogComponent } from '../../../shared/components/workora-confirm-dialog.component';
import { CompanyProfileTabComponent } from '../components/company-profile-tab.component';
import { DepartmentFormModalComponent } from '../components/department-form-modal.component';
import { DesignationFormModalComponent } from '../components/designation-form-modal.component';
import { BranchFormModalComponent } from '../components/branch-form-modal.component';

type OrgTab = 'departments' | 'designations' | 'branches' | 'company';

/**
 * Smart Container Page for Organization Structure & Governance.
 */
@Component({
  selector: 'app-organization-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    WorkoraSkeletonComponent,
    WorkoraPaginationComponent,
    WorkoraEmptyStateComponent,
    WorkoraConfirmDialogComponent,
    CompanyProfileTabComponent,
    DepartmentFormModalComponent,
    DesignationFormModalComponent,
    BranchFormModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl 2xl:max-w-8xl mx-auto space-y-6">
      
      <!-- Page Header & Tabs -->
      <div class="flex flex-col gap-4">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2.5">
              <span class="p-2 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68]">
                <span class="material-symbols-outlined text-2xl">account_tree</span>
              </span>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-[#063B39] tracking-tight font-heading">
                Organization Structure
              </h1>
            </div>
            <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Manage company identity, branches, departments hierarchy, and job designations.
            </p>
          </div>

          <!-- Multi-Company Switcher & Global Platform Shortcut (SuperAdmin Only) -->
          @if (authService.hasRole('SuperAdmin')) {
            <div class="flex flex-wrap items-center gap-3">
              @if (companiesList().length > 1) {
                <div class="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#DCEBE7] rounded-2xl shadow-2xs">
                  <span class="material-symbols-outlined text-base text-[#0E6E68]">domain</span>
                  <label class="text-xs font-bold text-slate-500">Active Company:</label>
                  <select 
                    [ngModel]="selectedCompanyId()" 
                    (ngModelChange)="onSelectCompany($event)"
                    class="text-xs font-extrabold text-[#063B39] bg-transparent border-none outline-none cursor-pointer pr-2">
                    @for (comp of companiesList(); track comp.id) {
                      <option [value]="comp.id">{{ comp.name }} ({{ comp.code }})</option>
                    }
                  </select>
                </div>
              }

              <a 
                routerLink="/superadmin"
                class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F4F8F7] hover:bg-[#DCEBE7] text-[#063B39] text-xs font-extrabold rounded-xl border border-[#DCEBE7] transition-colors cursor-pointer text-decoration-none">
                <span class="material-symbols-outlined text-base text-[#0E6E68]">hub</span>
                <span>All Organizations (Platform)</span>
                <span class="px-1.5 py-0.5 rounded-full text-[10px] bg-[#0E6E68] text-white font-extrabold">{{ companiesList().length || 3 }}</span>
              </a>
            </div>
          }
        </div>

        <!-- Tab Navigation Switcher -->
        <div class="flex items-center p-1.5 bg-white border border-[#DCEBE7] rounded-2xl shadow-2xs overflow-x-auto">
          <button 
            type="button" 
            (click)="activeTab.set('departments')"
            [ngClass]="activeTab() === 'departments' ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-slate-600 hover:text-[#063B39]'"
            class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none bg-transparent whitespace-nowrap">
            <span class="material-symbols-outlined text-base">corporate_fare</span>
            <span>Departments</span>
            <span [ngClass]="activeTab() === 'departments' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'" class="px-1.5 py-0.2 rounded-md text-[10px] font-extrabold">
              {{ totalDepartments() }}
            </span>
          </button>

          <button 
            type="button" 
            (click)="activeTab.set('designations')"
            [ngClass]="activeTab() === 'designations' ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-slate-600 hover:text-[#063B39]'"
            class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none bg-transparent whitespace-nowrap">
            <span class="material-symbols-outlined text-base">badge</span>
            <span>Designations</span>
            <span [ngClass]="activeTab() === 'designations' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'" class="px-1.5 py-0.2 rounded-md text-[10px] font-extrabold">
              {{ totalDesignations() }}
            </span>
          </button>

          <button 
            type="button" 
            (click)="activeTab.set('branches')"
            [ngClass]="activeTab() === 'branches' ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-slate-600 hover:text-[#063B39]'"
            class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none bg-transparent whitespace-nowrap">
            <span class="material-symbols-outlined text-base">location_city</span>
            <span>Branches</span>
            <span [ngClass]="activeTab() === 'branches' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'" class="px-1.5 py-0.2 rounded-md text-[10px] font-extrabold">
              {{ totalBranches() }}
            </span>
          </button>

          <button 
            type="button" 
            (click)="activeTab.set('company')"
            [ngClass]="activeTab() === 'company' ? 'bg-[#0E6E68] text-white shadow-xs' : 'text-slate-600 hover:text-[#063B39]'"
            class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none bg-transparent whitespace-nowrap">
            <span class="material-symbols-outlined text-base">domain</span>
            <span>Company Profile</span>
          </button>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- TAB 1: DEPARTMENTS -->
      <!-- ========================================================================= -->
      @if (activeTab() === 'departments') {
        <div class="space-y-4">
          <!-- Control Bar -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#DCEBE7] shadow-2xs">
            <div class="relative flex-1 max-w-md">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input 
                type="text" 
                [(ngModel)]="deptSearchTerm" 
                (ngModelChange)="onDeptSearch()"
                placeholder="Search departments by name or code..."
                class="w-full pl-9 pr-4 py-2 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
              />
            </div>

            <button 
              type="button" 
              (click)="openCreateDeptModal()"
              class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer border-none">
              <span class="material-symbols-outlined text-base">add</span>
              <span>New Department</span>
            </button>
          </div>

          <!-- Departments List/Table Card -->
          <div class="bg-white rounded-3xl border border-[#DCEBE7] shadow-xs overflow-hidden">
            @if (isLoadingDepts()) {
              <div class="p-6">
                <app-workora-skeleton type="table" [count]="5"></app-workora-skeleton>
              </div>
            } @else if (departments().length === 0) {
              <div class="p-12">
                <app-workora-empty-state 
                  icon="corporate_fare" 
                  title="No Departments Found"
                  description="Define organizational departments to group teams and map job titles."
                  actionLabel="Add Department"
                  (actionClick)="openCreateDeptModal()"
                ></app-workora-empty-state>
              </div>
            } @else {
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-[#F4F8F7]/80 border-b border-[#DCEBE7] text-[11px] font-extrabold uppercase tracking-wider text-[#063B39]/70">
                      <th class="py-3.5 px-5">Department</th>
                      <th class="py-3.5 px-4">Code</th>
                      <th class="py-3.5 px-4">Parent Dept</th>
                      <th class="py-3.5 px-4">Designations</th>
                      <th class="py-3.5 px-4">Status</th>
                      <th class="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#DCEBE7]/70 text-xs">
                    @for (dept of departments(); track dept.id) {
                      <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                        <td class="py-3.5 px-5">
                          <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-[#3FA79B]/15 text-[#0E6E68] flex items-center justify-center font-extrabold text-xs shrink-0">
                              {{ dept.code.slice(0, 3) }}
                            </div>
                            <div>
                              <p class="font-bold text-[#063B39]">{{ dept.name }}</p>
                              <p class="text-[10px] text-slate-400">Created {{ dept.createdAt | date:'mediumDate' }}</p>
                            </div>
                          </div>
                        </td>
                        <td class="py-3.5 px-4">
                          <span class="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-[#DCEBE7] text-[#063B39]">
                            {{ dept.code }}
                          </span>
                        </td>
                        <td class="py-3.5 px-4">
                          @if (dept.parentDepartmentName) {
                            <span class="inline-flex items-center gap-1 text-slate-600 font-semibold">
                              <span class="material-symbols-outlined text-xs text-slate-400">subdirectory_arrow_right</span>
                              {{ dept.parentDepartmentName }}
                            </span>
                          } @else {
                            <span class="text-slate-400 italic">Root Division</span>
                          }
                        </td>
                        <td class="py-3.5 px-4">
                          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#3FA79B]/10 text-[#0E6E68]">
                            <span class="material-symbols-outlined text-xs">badge</span>
                            {{ dept.designationsCount }} Roles
                          </span>
                        </td>
                        <td class="py-3.5 px-4">
                          @if (dept.isActive) {
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                            </span>
                          } @else {
                            <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500">Inactive</span>
                          }
                        </td>
                        <td class="py-3.5 px-5 text-right">
                          <div class="inline-flex items-center gap-1.5">
                            <button 
                              type="button" 
                              (click)="openEditDeptModal(dept)"
                              class="p-1.5 rounded-lg text-slate-500 hover:text-[#0E6E68] hover:bg-[#3FA79B]/10 transition-colors border-none bg-transparent cursor-pointer"
                              title="Edit Department">
                              <span class="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button 
                              type="button" 
                              (click)="promptDeleteDept(dept)"
                              class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border-none bg-transparent cursor-pointer"
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

              <!-- Pagination -->
              <div class="p-4 border-t border-[#DCEBE7]">
                <app-workora-pagination
                  [pageNumber]="deptPageIndex()"
                  [totalPages]="deptTotalPages()"
                  [totalCount]="totalDepartments()"
                  [pageSize]="deptPageSize"
                  (pageChange)="onDeptPageChange($event)"
                ></app-workora-pagination>
              </div>
            }
          </div>
        </div>
      }

      <!-- ========================================================================= -->
      <!-- TAB 2: DESIGNATIONS -->
      <!-- ========================================================================= -->
      @if (activeTab() === 'designations') {
        <div class="space-y-4">
          <!-- Control Bar -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#DCEBE7] shadow-2xs">
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              <div class="relative flex-1 max-w-md">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input 
                  type="text" 
                  [(ngModel)]="desigSearchTerm" 
                  (ngModelChange)="onDesigSearch()"
                  placeholder="Search job titles or grades..."
                  class="w-full pl-9 pr-4 py-2 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
                />
              </div>

              <!-- Department Filter -->
              <select 
                [(ngModel)]="selectedDeptFilter" 
                (ngModelChange)="loadDesignations()"
                class="px-3.5 py-2 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all">
                <option [ngValue]="undefined">All Departments</option>
                @for (d of departments(); track d.id) {
                  <option [ngValue]="d.id">{{ d.name }}</option>
                }
              </select>
            </div>

            <button 
              type="button" 
              (click)="openCreateDesigModal()"
              class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer border-none">
              <span class="material-symbols-outlined text-base">add</span>
              <span>New Designation</span>
            </button>
          </div>

          <!-- Designations List Card -->
          <div class="bg-white rounded-3xl border border-[#DCEBE7] shadow-xs overflow-hidden">
            @if (isLoadingDesigs()) {
              <div class="p-6">
                <app-workora-skeleton type="table" [count]="5"></app-workora-skeleton>
              </div>
            } @else if (designations().length === 0) {
              <div class="p-12">
                <app-workora-empty-state 
                  icon="badge" 
                  title="No Designations Found"
                  description="Create job designations to establish seniority levels and career tracks."
                  actionLabel="Add Designation"
                  (actionClick)="openCreateDesigModal()"
                ></app-workora-empty-state>
              </div>
            } @else {
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-[#F4F8F7]/80 border-b border-[#DCEBE7] text-[11px] font-extrabold uppercase tracking-wider text-[#063B39]/70">
                      <th class="py-3.5 px-5">Job Title</th>
                      <th class="py-3.5 px-4">Department</th>
                      <th class="py-3.5 px-4">Level &amp; Grade</th>
                      <th class="py-3.5 px-4">Description</th>
                      <th class="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#DCEBE7]/70 text-xs">
                    @for (desig of designations(); track desig.id) {
                      <tr class="hover:bg-[#F4F8F7]/50 transition-colors">
                        <td class="py-3.5 px-5">
                          <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-[#0E6E68]/10 text-[#0E6E68] flex items-center justify-center font-bold text-xs shrink-0">
                              L{{ desig.level }}
                            </div>
                            <p class="font-bold text-[#063B39]">{{ desig.title }}</p>
                          </div>
                        </td>
                        <td class="py-3.5 px-4">
                          <span class="font-semibold text-slate-700">{{ desig.departmentName || 'General' }}</span>
                        </td>
                        <td class="py-3.5 px-4">
                          <div class="flex items-center gap-1.5">
                            <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#3FA79B]/20 text-[#0E6E68]">
                              Level {{ desig.level }}
                            </span>
                            @if (desig.grade) {
                              <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-800">
                                {{ desig.grade }}
                              </span>
                            }
                          </div>
                        </td>
                        <td class="py-3.5 px-4 max-w-xs truncate text-slate-500">
                          {{ desig.description || '—' }}
                        </td>
                        <td class="py-3.5 px-5 text-right">
                          <div class="inline-flex items-center gap-1.5">
                            <button 
                              type="button" 
                              (click)="openEditDesigModal(desig)"
                              class="p-1.5 rounded-lg text-slate-500 hover:text-[#0E6E68] hover:bg-[#3FA79B]/10 transition-colors border-none bg-transparent cursor-pointer"
                              title="Edit Designation">
                              <span class="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button 
                              type="button" 
                              (click)="promptDeleteDesig(desig)"
                              class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border-none bg-transparent cursor-pointer"
                              title="Delete Designation">
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
                  [pageNumber]="desigPageIndex()"
                  [totalPages]="desigTotalPages()"
                  [totalCount]="totalDesignations()"
                  [pageSize]="desigPageSize"
                  (pageChange)="onDesigPageChange($event)"
                ></app-workora-pagination>
              </div>
            }
          </div>
        </div>
      }

      <!-- ========================================================================= -->
      <!-- TAB 3: BRANCHES -->
      <!-- ========================================================================= -->
      @if (activeTab() === 'branches') {
        <div class="space-y-4">
          <!-- Control Bar -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#DCEBE7] shadow-2xs">
            <div class="relative flex-1 max-w-md">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input 
                type="text" 
                [(ngModel)]="branchSearchTerm" 
                (ngModelChange)="onBranchSearch()"
                placeholder="Search branches by location or name..."
                class="w-full pl-9 pr-4 py-2 bg-[#F4F8F7] text-xs text-[#063B39] rounded-xl border border-[#DCEBE7] focus:border-[#0E6E68] outline-none font-medium transition-all"
              />
            </div>

            <button 
              type="button" 
              (click)="openCreateBranchModal()"
              class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0E6E68] hover:bg-[#063B39] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer border-none">
              <span class="material-symbols-outlined text-base">add_location_alt</span>
              <span>Add Branch Office</span>
            </button>
          </div>

          <!-- Branches Grid Cards -->
          @if (isLoadingBranches()) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              @for (i of [1,2,3]; track i) {
                <app-workora-skeleton type="card"></app-workora-skeleton>
              }
            </div>
          } @else if (branches().length === 0) {
            <div class="bg-white rounded-3xl p-12 border border-[#DCEBE7] shadow-xs">
              <app-workora-empty-state 
                icon="location_city" 
                title="No Branch Offices Found"
                description="Register regional offices and operational hubs for accurate localized attendance & timezone sync."
                actionLabel="Add Branch"
                (actionClick)="openCreateBranchModal()"
              ></app-workora-empty-state>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              @for (branch of branches(); track branch.id) {
                <div class="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCEBE7] shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between group">
                  <div>
                    <div class="flex items-start justify-between gap-3 mb-3">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-2xl bg-[#0E6E68]/10 text-[#0E6E68] flex items-center justify-center font-bold">
                          <span class="material-symbols-outlined text-xl">domain</span>
                        </div>
                        <div>
                          <h3 class="font-extrabold text-sm text-[#063B39]">{{ branch.name }}</h3>
                          <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#DCEBE7] text-[#063B39]">
                            {{ branch.code }}
                          </span>
                        </div>
                      </div>

                      @if (branch.isHeadOffice) {
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                          ★ Head Office
                        </span>
                      }
                    </div>

                    <div class="space-y-1.5 text-xs text-slate-600 mt-4">
                      <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-sm text-[#0E6E68]">place</span>
                        <span class="font-bold text-[#063B39]">{{ branch.location }}</span>
                      </div>

                      @if (branch.address) {
                        <p class="text-[11px] text-slate-500 pl-6 leading-relaxed">{{ branch.address }}</p>
                      }

                      <div class="flex items-center gap-2 pt-2">
                        <span class="material-symbols-outlined text-sm text-slate-400">schedule</span>
                        <span class="text-[11px] font-medium text-slate-500">{{ branch.timezone }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between pt-4 mt-5 border-t border-[#DCEBE7]">
                    <span class="text-[10px] font-bold text-slate-400">#{{ branch.id }}</span>
                    <div class="flex items-center gap-1">
                      <button 
                        type="button" 
                        (click)="openEditBranchModal(branch)"
                        class="p-1.5 rounded-lg text-slate-500 hover:text-[#0E6E68] hover:bg-[#3FA79B]/10 transition-colors border-none bg-transparent cursor-pointer"
                        title="Edit Branch">
                        <span class="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button 
                        type="button" 
                        (click)="promptDeleteBranch(branch)"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border-none bg-transparent cursor-pointer"
                        title="Delete Branch">
                        <span class="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Pagination -->
            <div class="bg-white rounded-2xl p-4 border border-[#DCEBE7]">
              <app-workora-pagination
                [pageNumber]="branchPageIndex()"
                [totalPages]="branchTotalPages()"
                [totalCount]="totalBranches()"
                [pageSize]="branchPageSize"
                (pageChange)="onBranchPageChange($event)"
              ></app-workora-pagination>
            </div>
          }
        </div>
      }

      <!-- ========================================================================= -->
      <!-- TAB 4: COMPANY PROFILE -->
      <!-- ========================================================================= -->
      @if (activeTab() === 'company') {
        <app-company-profile-tab
          [company]="companyProfile()"
          [isSaving]="isSavingCompany()"
          (saveProfile)="onUpdateCompanyProfile($event)"
          (saveLogo)="onUpdateCompanyLogo($event)"
        ></app-company-profile-tab>
      }

      <!-- Modals -->
      @if (isDeptModalOpen()) {
        <app-department-form-modal
          [department]="selectedDept()"
          [availableDepartments]="departments()"
          [companyId]="companyProfile()?.id || 1"
          [isSubmitting]="isSubmittingModal()"
          (closeModal)="isDeptModalOpen.set(false)"
          (saveDepartment)="onSaveDepartment($event)"
        ></app-department-form-modal>
      }

      @if (isDesigModalOpen()) {
        <app-designation-form-modal
          [designation]="selectedDesig()"
          [departments]="departments()"
          [isSubmitting]="isSubmittingModal()"
          (closeModal)="isDesigModalOpen.set(false)"
          (saveDesignation)="onSaveDesignation($event)"
        ></app-designation-form-modal>
      }

      @if (isBranchModalOpen()) {
        <app-branch-form-modal
          [branch]="selectedBranch()"
          [companyId]="companyProfile()?.id || 1"
          [isSubmitting]="isSubmittingModal()"
          (closeModal)="isBranchModalOpen.set(false)"
          (saveBranch)="onSaveBranch($event)"
        ></app-branch-form-modal>
      }

      <!-- Confirmation Dialog -->
      @if (confirmDialogState(); as dialog) {
        <app-workora-confirm-dialog
          [isOpen]="true"
          [title]="dialog.title"
          [message]="dialog.message"
          [confirmText]="dialog.confirmText || 'Delete'"
          variant="danger"
          (confirm)="dialog.onConfirm()"
          (cancel)="confirmDialogState.set(null)"
        ></app-workora-confirm-dialog>
      }

    </div>
  `
})
export class OrganizationPageComponent implements OnInit {
  private readonly orgRepo = inject(OrganizationApiRepository);
  private readonly notificationService = inject(NotificationService);
  readonly authService = inject(AuthService);

  readonly activeTab = signal<OrgTab>('departments');

  // Multi-Company State
  readonly companiesList = signal<Company[]>([]);
  readonly selectedCompanyId = signal<number | null>(null);

  // Company State
  readonly companyProfile = signal<Company | null>(null);
  readonly isSavingCompany = signal<boolean>(false);

  // Departments State
  readonly departments = signal<Department[]>([]);
  readonly totalDepartments = signal<number>(0);
  readonly deptPageIndex = signal<number>(1);
  readonly deptTotalPages = signal<number>(1);
  readonly isLoadingDepts = signal<boolean>(false);
  deptSearchTerm = '';
  readonly deptPageSize = 10;

  // Designations State
  readonly designations = signal<Designation[]>([]);
  readonly totalDesignations = signal<number>(0);
  readonly desigPageIndex = signal<number>(1);
  readonly desigTotalPages = signal<number>(1);
  readonly isLoadingDesigs = signal<boolean>(false);
  desigSearchTerm = '';
  selectedDeptFilter?: number;
  readonly desigPageSize = 10;

  // Branches State
  readonly branches = signal<Branch[]>([]);
  readonly totalBranches = signal<number>(0);
  readonly branchPageIndex = signal<number>(1);
  readonly branchTotalPages = signal<number>(1);
  readonly isLoadingBranches = signal<boolean>(false);
  branchSearchTerm = '';
  readonly branchPageSize = 9;

  // Modal & Dialog Signals
  readonly isDeptModalOpen = signal<boolean>(false);
  readonly selectedDept = signal<Department | null>(null);

  readonly isDesigModalOpen = signal<boolean>(false);
  readonly selectedDesig = signal<Designation | null>(null);

  readonly isBranchModalOpen = signal<boolean>(false);
  readonly selectedBranch = signal<Branch | null>(null);

  readonly isSubmittingModal = signal<boolean>(false);

  readonly confirmDialogState = signal<{
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  } | null>(null);

  ngOnInit(): void {
    this.loadCompaniesList();
  }

  // ==========================================
  // Company & Multi-Tenant Actions
  // ==========================================

  loadCompaniesList(): void {
    this.orgRepo.getCompaniesList().subscribe({
      next: (companies) => {
        this.companiesList.set(companies);
        if (companies.length > 0 && !this.selectedCompanyId()) {
          const first = companies[0];
          this.selectedCompanyId.set(first.id);
          this.loadAllDataForCompany(first.id);
        } else {
          this.loadAllDataForCompany(this.selectedCompanyId() ?? undefined);
        }
      },
      error: () => {
        this.loadAllDataForCompany(undefined);
      }
    });
  }

  onSelectCompany(companyId: number | string): void {
    const id = typeof companyId === 'string' ? parseInt(companyId, 10) : companyId;
    this.selectedCompanyId.set(id);
    this.deptPageIndex.set(1);
    this.desigPageIndex.set(1);
    this.branchPageIndex.set(1);
    this.loadAllDataForCompany(id);
  }

  private loadAllDataForCompany(companyId?: number): void {
    this.loadCompanyProfile(companyId);
    this.loadDepartments(companyId);
    this.loadDesignations();
    this.loadBranches(companyId);
  }

  loadCompanyProfile(id?: number): void {
    const targetId = id ?? this.selectedCompanyId() ?? undefined;
    this.orgRepo.getCompanyProfile(targetId).subscribe({
      next: company => {
        this.companyProfile.set(company);
        if (!this.selectedCompanyId()) {
          this.selectedCompanyId.set(company.id);
        }
      },
      error: () => {
        // Fallback default mock for preview if fresh database
        this.companyProfile.set({
          id: 1,
          uuid: '00000000-0000-0000-0000-000000000001',
          name: 'Workora Global Enterprise',
          code: 'WORKORA',
          fiscalYearStartMonth: 1,
          currency: 'USD',
          isActive: true,
          createdAt: new Date().toISOString()
        });
      }
    });
  }

  onUpdateCompanyProfile(params: UpdateCompanyProfileParams): void {
    this.isSavingCompany.set(true);
    this.orgRepo.updateCompanyProfile(params)
      .pipe(finalize(() => this.isSavingCompany.set(false)))
      .subscribe({
        next: updated => {
          this.companyProfile.set(updated);
          this.notificationService.showSuccess('Company profile updated successfully.');
        },
        error: err => this.notificationService.showError(err.message || 'Failed to update company profile.')
      });
  }

  onUpdateCompanyLogo(logoUrl: string): void {
    this.orgRepo.uploadCompanyLogo(logoUrl, this.companyProfile()?.id).subscribe({
      next: () => {
        if (this.companyProfile()) {
          this.companyProfile.update(c => c ? { ...c, logoUrl } : null);
        }
        this.notificationService.showSuccess('Company logo updated.');
      },
      error: err => this.notificationService.showError(err.message || 'Failed to update logo.')
    });
  }

  // ==========================================
  // Department Actions
  // ==========================================

  loadDepartments(companyId?: number): void {
    this.isLoadingDepts.set(true);
    const targetCompanyId = companyId ?? this.selectedCompanyId() ?? undefined;
    this.orgRepo.getDepartments({
      pageNumber: this.deptPageIndex(),
      pageSize: this.deptPageSize,
      searchTerm: this.deptSearchTerm || undefined,
      companyId: targetCompanyId
    })
    .pipe(finalize(() => this.isLoadingDepts.set(false)))
    .subscribe({
      next: paged => {
        this.departments.set(paged.items);
        this.totalDepartments.set(paged.totalCount);
        this.deptTotalPages.set(paged.totalPages);
      },
      error: err => this.notificationService.showError(err.message || 'Failed to load departments.')
    });
  }

  onDeptSearch(): void {
    this.deptPageIndex.set(1);
    this.loadDepartments();
  }

  onDeptPageChange(page: number): void {
    this.deptPageIndex.set(page);
    this.loadDepartments();
  }

  openCreateDeptModal(): void {
    this.selectedDept.set(null);
    this.isDeptModalOpen.set(true);
  }

  openEditDeptModal(dept: Department): void {
    this.selectedDept.set(dept);
    this.isDeptModalOpen.set(true);
  }

  onSaveDepartment(params: CreateDepartmentParams | UpdateDepartmentParams): void {
    this.isSubmittingModal.set(true);
    const obs = 'id' in params
      ? this.orgRepo.updateDepartment(params)
      : this.orgRepo.createDepartment(params);

    obs.pipe(finalize(() => this.isSubmittingModal.set(false))).subscribe({
      next: () => {
        this.isDeptModalOpen.set(false);
        this.notificationService.showSuccess('Department saved successfully.');
        this.loadDepartments();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to save department.')
    });
  }

  promptDeleteDept(dept: Department): void {
    this.confirmDialogState.set({
      title: `Delete Department: ${dept.name}`,
      message: `Are you sure you want to delete "${dept.name}" (${dept.code})? Any associated designations should be reassigned first.`,
      onConfirm: () => {
        this.orgRepo.deleteDepartment(dept.id).subscribe({
          next: () => {
            this.confirmDialogState.set(null);
            this.notificationService.showSuccess('Department deleted successfully.');
            this.loadDepartments();
          },
          error: err => this.notificationService.showError(err.message || 'Failed to delete department.')
        });
      }
    });
  }

  // ==========================================
  // Designation Actions
  // ==========================================

  loadDesignations(): void {
    this.isLoadingDesigs.set(true);
    this.orgRepo.getDesignations({
      pageNumber: this.desigPageIndex(),
      pageSize: this.desigPageSize,
      searchTerm: this.desigSearchTerm || undefined,
      departmentId: this.selectedDeptFilter
    })
    .pipe(finalize(() => this.isLoadingDesigs.set(false)))
    .subscribe({
      next: paged => {
        this.designations.set(paged.items);
        this.totalDesignations.set(paged.totalCount);
        this.desigTotalPages.set(paged.totalPages);
      },
      error: err => this.notificationService.showError(err.message || 'Failed to load designations.')
    });
  }

  onDesigSearch(): void {
    this.desigPageIndex.set(1);
    this.loadDesignations();
  }

  onDesigPageChange(page: number): void {
    this.desigPageIndex.set(page);
    this.loadDesignations();
  }

  openCreateDesigModal(): void {
    this.selectedDesig.set(null);
    this.isDesigModalOpen.set(true);
  }

  openEditDesigModal(desig: Designation): void {
    this.selectedDesig.set(desig);
    this.isDesigModalOpen.set(true);
  }

  onSaveDesignation(params: CreateDesignationParams | UpdateDesignationParams): void {
    this.isSubmittingModal.set(true);
    const obs = 'id' in params
      ? this.orgRepo.updateDesignation(params)
      : this.orgRepo.createDesignation(params);

    obs.pipe(finalize(() => this.isSubmittingModal.set(false))).subscribe({
      next: () => {
        this.isDesigModalOpen.set(false);
        this.notificationService.showSuccess('Designation saved successfully.');
        this.loadDesignations();
        this.loadDepartments();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to save designation.')
    });
  }

  promptDeleteDesig(desig: Designation): void {
    this.confirmDialogState.set({
      title: `Delete Designation: ${desig.title}`,
      message: `Are you sure you want to remove the designation "${desig.title}"?`,
      onConfirm: () => {
        this.orgRepo.deleteDesignation(desig.id).subscribe({
          next: () => {
            this.confirmDialogState.set(null);
            this.notificationService.showSuccess('Designation deleted successfully.');
            this.loadDesignations();
          },
          error: err => this.notificationService.showError(err.message || 'Failed to delete designation.')
        });
      }
    });
  }

  // ==========================================
  // Branch Actions
  // ==========================================

  loadBranches(companyId?: number): void {
    this.isLoadingBranches.set(true);
    const targetCompanyId = companyId ?? this.selectedCompanyId() ?? undefined;
    this.orgRepo.getBranches({
      pageNumber: this.branchPageIndex(),
      pageSize: this.branchPageSize,
      searchTerm: this.branchSearchTerm || undefined,
      companyId: targetCompanyId
    })
    .pipe(finalize(() => this.isLoadingBranches.set(false)))
    .subscribe({
      next: paged => {
        this.branches.set(paged.items);
        this.totalBranches.set(paged.totalCount);
        this.branchTotalPages.set(paged.totalPages);
      },
      error: err => this.notificationService.showError(err.message || 'Failed to load branches.')
    });
  }

  onBranchSearch(): void {
    this.branchPageIndex.set(1);
    this.loadBranches();
  }

  onBranchPageChange(page: number): void {
    this.branchPageIndex.set(page);
    this.loadBranches();
  }

  openCreateBranchModal(): void {
    this.selectedBranch.set(null);
    this.isBranchModalOpen.set(true);
  }

  openEditBranchModal(branch: Branch): void {
    this.selectedBranch.set(branch);
    this.isBranchModalOpen.set(true);
  }

  onSaveBranch(params: CreateBranchParams | UpdateBranchParams): void {
    this.isSubmittingModal.set(true);
    const obs = 'id' in params
      ? this.orgRepo.updateBranch(params)
      : this.orgRepo.createBranch(params);

    obs.pipe(finalize(() => this.isSubmittingModal.set(false))).subscribe({
      next: () => {
        this.isBranchModalOpen.set(false);
        this.notificationService.showSuccess('Branch saved successfully.');
        this.loadBranches();
      },
      error: err => this.notificationService.showError(err.message || 'Failed to save branch.')
    });
  }

  promptDeleteBranch(branch: Branch): void {
    this.confirmDialogState.set({
      title: `Delete Branch: ${branch.name}`,
      message: `Are you sure you want to remove the branch office "${branch.name}" (${branch.code})?`,
      onConfirm: () => {
        this.orgRepo.deleteBranch(branch.id).subscribe({
          next: () => {
            this.confirmDialogState.set(null);
            this.notificationService.showSuccess('Branch deleted successfully.');
            this.loadBranches();
          },
          error: err => this.notificationService.showError(err.message || 'Failed to delete branch.')
        });
      }
    });
  }
}
