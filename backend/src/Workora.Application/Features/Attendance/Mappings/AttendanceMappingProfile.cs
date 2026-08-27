using AutoMapper;
using Workora.Application.Features.Attendance.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Attendance.Mappings;

/// <summary>
/// AutoMapper profile for <see cref="AttendanceRecord"/> and <see cref="AttendanceCorrection"/> entities.
/// </summary>
public class AttendanceMappingProfile : Profile
{
    /// <summary>
    /// Initializes mapping rules for Attendance.
    /// </summary>
    public AttendanceMappingProfile()
    {
        CreateMap<AttendanceRecord, AttendanceRecordDto>()
            .ForMember(d => d.EmployeeName, opt => opt.MapFrom(s => s.Employee != null ? $"{s.Employee.FirstName} {s.Employee.LastName}".Trim() : null))
            .ForMember(d => d.EmployeeCode, opt => opt.MapFrom(s => s.Employee != null ? s.Employee.EmployeeCode : null))
            .ForMember(d => d.ShiftName, opt => opt.MapFrom(s => s.Shift != null ? s.Shift.Name : null));

        CreateMap<AttendanceCorrection, AttendanceCorrectionDto>()
            .ForMember(d => d.EmployeeId, opt => opt.MapFrom(s => s.AttendanceRecord != null ? s.AttendanceRecord.EmployeeId : 0))
            .ForMember(d => d.EmployeeName, opt => opt.MapFrom(s => s.AttendanceRecord != null && s.AttendanceRecord.Employee != null ? $"{s.AttendanceRecord.Employee.FirstName} {s.AttendanceRecord.Employee.LastName}".Trim() : null))
            .ForMember(d => d.EmployeeCode, opt => opt.MapFrom(s => s.AttendanceRecord != null && s.AttendanceRecord.Employee != null ? s.AttendanceRecord.Employee.EmployeeCode : null))
            .ForMember(d => d.AttendanceDate, opt => opt.MapFrom(s => s.AttendanceRecord != null ? s.AttendanceRecord.AttendanceDate : default))
            .ForMember(d => d.OriginalCheckInTime, opt => opt.MapFrom(s => s.AttendanceRecord != null ? s.AttendanceRecord.CheckInTime : null))
            .ForMember(d => d.OriginalCheckOutTime, opt => opt.MapFrom(s => s.AttendanceRecord != null ? s.AttendanceRecord.CheckOutTime : null));
    }
}
