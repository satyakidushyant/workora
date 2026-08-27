using AutoMapper;
using MediatR;
using Workora.Application.Features.Overtime.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Overtime.Queries.GetOvertimeRequestsList;

/// <summary>
/// Query to retrieve a paginated and filtered list of overtime requests.
/// </summary>
public record GetOvertimeRequestsListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    int? EmployeeId = null,
    int? DepartmentId = null,
    OvertimeRequestStatus? Status = null,
    DateOnly? FromDate = null,
    DateOnly? ToDate = null) : IRequest<ApiResponse<PagedResponse<OvertimeRequestDto>>>;
