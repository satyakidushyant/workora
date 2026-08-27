using AutoMapper;
using MediatR;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.Queries.GetLeaveRequestsList;

/// <summary>
/// Query to retrieve a paginated and filtered list of leave requests.
/// </summary>
public record GetLeaveRequestsListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    int? EmployeeId = null,
    int? DepartmentId = null,
    LeaveRequestStatus? Status = null,
    DateOnly? FromDate = null,
    DateOnly? ToDate = null,
    int? CompanyId = null) : IRequest<ApiResponse<PagedResponse<LeaveRequestDto>>>;
