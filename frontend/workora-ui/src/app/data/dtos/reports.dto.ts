export interface HeadcountTrendItemDto {
  period: string;
  headcount: number;
  joiners: number;
  leavers: number;
}

export interface HeadcountReportDto {
  totalEmployees: number;
  activeEmployees: number;
  trend: HeadcountTrendItemDto[];
}

export interface AttendanceReportDto {
  totalPresent: number;
  onTime: number;
  late: number;
  checkedOut: number;
}

export interface LeaveReportDto {
  year: number;
  utilizationByType: { [key: string]: number };
}

export interface PayrollExpenseItemDto {
  period: string;
  grossTotal: number;
  deductionsTotal: number;
  netTotal: number;
}

export interface PayrollReportDto {
  history: PayrollExpenseItemDto[];
}

export interface AttritionReportDto {
  year: number;
  totalExits: number;
  attritionRatePercentage: number;
}

export interface CustomReportExportDto {
  fileName: string;
  fileContentBase64: string;
  downloadUrl?: string | null;
}
