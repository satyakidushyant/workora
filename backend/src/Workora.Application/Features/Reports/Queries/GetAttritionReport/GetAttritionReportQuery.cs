using MediatR;
using Workora.Application.Features.Reports.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Reports.Queries.GetAttritionReport;

/// <summary>
/// Query to compute attrition report.
/// </summary>
public record GetAttritionReportQuery(int? CompanyId = null, int Year = 0) : IRequest<ApiResponse<AttritionReportDto>>;
