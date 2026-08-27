using MediatR;
using Workora.Application.Features.Dashboard.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Dashboard.Queries.GetHeadcountByDepartment;

/// <summary>
/// Query to get departmental headcount distribution for the dashboard charts.
/// </summary>
public record GetHeadcountByDepartmentQuery(int? CompanyId = null) : IRequest<ApiResponse<IReadOnlyList<DepartmentHeadcountDto>>>;
