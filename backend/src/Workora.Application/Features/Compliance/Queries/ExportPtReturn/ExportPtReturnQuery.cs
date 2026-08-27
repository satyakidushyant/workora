using System.Text;
using MediatR;
using Workora.Application.Features.Compliance.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Compliance.Queries.ExportPtReturn;

/// <summary>
/// Query to generate state Professional Tax (PT) monthly return CSV.
/// </summary>
public record ExportPtReturnQuery(int Month, int Year, int? CompanyId) : IRequest<ApiResponse<StatutoryExportFileDto>>;
