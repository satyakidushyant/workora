using AutoMapper;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetPayrollRunsList;

/// <summary>
/// Query to retrieve a paginated list of payroll run cycles.
/// </summary>
public record GetPayrollRunsListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    int? CompanyId = null,
    PayrollStatus? Status = null) : IRequest<ApiResponse<PagedResponse<PayrollRunDto>>>;
