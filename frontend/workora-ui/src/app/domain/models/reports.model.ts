export interface HeadcountTrendItem {
  period: string;
  headcount: number;
  joiners: number;
  leavers: number;
}

export interface HeadcountReport {
  totalEmployees: number;
  activeEmployees: number;
  trend: HeadcountTrendItem[];
}

export interface AttendanceReport {
  totalPresent: number;
  onTime: number;
  late: number;
  checkedOut: number;
}

export interface LeaveReport {
  year: number;
  utilizationByType: { [key: string]: number };
}

export interface PayrollExpenseItem {
  period: string;
  grossTotal: number;
  deductionsTotal: number;
  netTotal: number;
}

export interface PayrollReport {
  history: PayrollExpenseItem[];
}

export interface AttritionReport {
  year: number;
  totalExits: number;
  attritionRatePercentage: number;
}

export interface CustomReportExport {
  fileName: string;
  fileContentBase64: string;
  downloadUrl?: string | null;
}
