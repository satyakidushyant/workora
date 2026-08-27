using AutoMapper;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Queries.GetAppraisalsList;

/// <summary>
/// Query to retrieve a paginated and filtered list of performance appraisals.
/// </summary>
public record GetAppraisalsListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    int? EmployeeId = null,
    int? ReviewerId = null,
    int? Year = null,
    AppraisalStatus? Status = null) : IRequest<ApiResponse<PagedResponse<AppraisalDto>>>;
