using AutoMapper;
using Workora.Application.Features.Expenses.DTOs;
using Workora.Domain.Entities;

namespace Workora.Application.Features.Expenses.Mappings;

/// <summary>
/// AutoMapper profile for ExpenseClaim entity.
/// </summary>
public class ExpenseMappingProfile : Profile
{
    /// <summary>
    /// Initializes mappings.
    /// </summary>
    public ExpenseMappingProfile()
    {
        CreateMap<ExpenseClaim, ExpenseClaimDto>()
            .ForMember(d => d.EmployeeName, opt => opt.MapFrom(s => s.Employee != null ? $"{s.Employee.FirstName} {s.Employee.LastName}".Trim() : null))
            .ForMember(d => d.EmployeeCode, opt => opt.MapFrom(s => s.Employee != null ? s.Employee.EmployeeCode : null));
    }
}
