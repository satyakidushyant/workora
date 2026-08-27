using System.Text;
using MediatR;
using Workora.Application.Features.Compliance.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Compliance.Queries.ExportEsicMonthlyReturn;

/// <summary>
/// Query to generate ESIC Monthly Contribution CSV export for portal upload.
/// </summary>
public record ExportEsicMonthlyReturnQuery(int Month, int Year, int? CompanyId) : IRequest<ApiResponse<StatutoryExportFileDto>>;
