using MediatR;
using Workora.Application.Features.Compliance.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Compliance.Queries.GetStatutorySummary;

/// <summary>
/// Query to calculate company-wide statutory deduction breakdown (PF, ESIC, PT, TDS) for a given month.
/// </summary>
public record GetStatutorySummaryQuery(int Month, int Year, int? CompanyId) : IRequest<ApiResponse<StatutorySummaryDto>>;
