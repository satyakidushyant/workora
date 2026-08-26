import {
  HeadcountReportDto,
  AttendanceReportDto,
  LeaveReportDto,
  PayrollReportDto,
  AttritionReportDto,
  CustomReportExportDto
} from '../dtos/reports.dto';
import {
  HeadcountReport,
  AttendanceReport,
  LeaveReport,
  PayrollReport,
  AttritionReport,
  CustomReportExport
} from '../../domain/models/reports.model';

export class ReportsMapper {
  static fromHeadcountDto(dto: HeadcountReportDto): HeadcountReport {
    return {
      totalEmployees: dto.totalEmployees,
      activeEmployees: dto.activeEmployees,
      trend: (dto.trend || []).map(t => ({
        period: t.period,
        headcount: t.headcount,
        joiners: t.joiners,
        leavers: t.leavers
      }))
    };
  }

  static fromAttendanceDto(dto: AttendanceReportDto): AttendanceReport {
    return {
      totalPresent: dto.totalPresent,
      onTime: dto.onTime,
      late: dto.late,
      checkedOut: dto.checkedOut
    };
  }

  static fromLeaveDto(dto: LeaveReportDto): LeaveReport {
    return {
      year: dto.year,
      utilizationByType: dto.utilizationByType || {}
    };
  }

  static fromPayrollDto(dto: PayrollReportDto): PayrollReport {
    return {
      history: (dto.history || []).map(h => ({
        period: h.period,
        grossTotal: h.grossTotal,
        deductionsTotal: h.deductionsTotal,
        netTotal: h.netTotal
      }))
    };
  }

  static fromAttritionDto(dto: AttritionReportDto): AttritionReport {
    return {
      year: dto.year,
      totalExits: dto.totalExits,
      attritionRatePercentage: dto.attritionRatePercentage
    };
  }

  static fromCustomExportDto(dto: CustomReportExportDto): CustomReportExport {
    return {
      fileName: dto.fileName,
      fileContentBase64: dto.fileContentBase64,
      downloadUrl: dto.downloadUrl
    };
  }
}
