using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Branches.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Branches.Queries.GetBranchesList;

/// <summary>
/// Query to get a paginated list of branches.
/// </summary>
public record GetBranchesListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    string? SearchTerm = null,
    bool? IsActive = null,
    int? CompanyId = null) : IRequest<ApiResponse<PagedResponse<BranchDto>>>;
