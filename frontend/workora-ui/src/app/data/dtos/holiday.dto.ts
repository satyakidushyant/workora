export interface HolidayDto {
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

export interface WeeklyOffPolicyDto {
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

export interface CreateHolidayRequestDto {
  companyId: number;
  name: string;
  date: string;
  type: string;
  branchId?: number | null;
  description?: string | null;
}

export interface UpdateHolidayRequestDto {
  name: string;
  date: string;
  type: string;
  branchId?: number | null;
  description?: string | null;
}
