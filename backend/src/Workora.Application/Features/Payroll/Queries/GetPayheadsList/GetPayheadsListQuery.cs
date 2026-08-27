using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetPayheadsList;

/// <summary>
/// Query to list salary payheads.
/// </summary>
public record GetPayheadsListQuery(int? CompanyId = null) : IRequest<ApiResponse<IReadOnlyList<PayheadDto>>>;
