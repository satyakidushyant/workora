using AutoMapper;
using MediatR;
using Workora.Application.Features.Designations.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Designations.Queries.GetDesignationsList;

/// <summary>
/// Query to get a paginated list of designations.
/// </summary>
public record GetDesignationsListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    string? SearchTerm = null,
    int? DepartmentId = null) : IRequest<ApiResponse<PagedResponse<DesignationDto>>>;
