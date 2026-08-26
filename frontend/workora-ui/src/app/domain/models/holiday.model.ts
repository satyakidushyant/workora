/**
 * Domain model representing a company/public holiday.
 */
export interface Holiday {
  id: number;
  uuid: string;
  companyId: number;
  branchId?: number | null;
  branchName?: string | null;
  name: string;
  date: string;
  type: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
}

/**
 * Domain model representing weekly off policy.
 */
export interface WeeklyOffPolicy {
  companyId: number;
  mondayOff: boolean;
  tuesdayOff: boolean;
  wednesdayOff: boolean;
  thursdayOff: boolean;
  fridayOff: boolean;
  saturdayOff: boolean;
  sundayOff: boolean;
  alternateSaturdayOff: boolean;
}

/**
 * Parameters for creating or updating a holiday.
 */
export interface SaveHolidayParams {
  id?: number;
  companyId: number;
  name: string;
  date: string;
  type: string;
  branchId?: number | null;
  description?: string | null;
}
