using MediatR;
using Workora.Application.Features.Reports.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Reports.Queries.GetHeadcountReport;

/// <summary>
/// Query to generate headcount growth and turnover analytics.
/// </summary>
public record GetHeadcountReportQuery(int? CompanyId = null) : IRequest<ApiResponse<HeadcountReportDto>>;
