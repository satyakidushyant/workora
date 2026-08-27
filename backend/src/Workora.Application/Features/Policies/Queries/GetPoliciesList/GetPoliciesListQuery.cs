using AutoMapper;
using MediatR;
using Workora.Application.Features.Policies.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Policies.Queries.GetPoliciesList;

/// <summary>
/// Query to retrieve a paginated list of company policies.
/// </summary>
public record GetPoliciesListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    int? CompanyId = null) : IRequest<ApiResponse<PagedResponse<PolicyDto>>>;
