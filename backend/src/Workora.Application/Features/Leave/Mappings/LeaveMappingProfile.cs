using AutoMapper;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Leave.Mappings;

/// <summary>
/// AutoMapper profile for Leave entities.
/// </summary>
public class LeaveMappingProfile : Profile
{
    /// <summary>
    /// Initializes mapping rules for Leave.
    /// </summary>
    public LeaveMappingProfile()
    {
        CreateMap<LeaveType, LeaveTypeDto>();
        CreateMap<LeaveApproval, LeaveApprovalDto>();

        CreateMap<LeaveRequest, LeaveRequestDto>()
            .ForMember(d => d.EmployeeName, opt => opt.MapFrom(s => s.Employee != null ? $"{s.Employee.FirstName} {s.Employee.LastName}".Trim() : null))
            .ForMember(d => d.EmployeeCode, opt => opt.MapFrom(s => s.Employee != null ? s.Employee.EmployeeCode : null))
            .ForMember(d => d.LeaveTypeName, opt => opt.MapFrom(s => s.LeaveType != null ? s.LeaveType.Name : null))
            .ForMember(d => d.Approvals, opt => opt.MapFrom(s => s.Approvals));

        CreateMap<LeaveBalance, LeaveBalanceDto>()
            .ForMember(d => d.LeaveTypeName, opt => opt.MapFrom(s => s.LeaveType != null ? s.LeaveType.Name : string.Empty))
            .ForMember(d => d.LeaveTypeCode, opt => opt.MapFrom(s => s.LeaveType != null ? s.LeaveType.Code : string.Empty));
    }
}
