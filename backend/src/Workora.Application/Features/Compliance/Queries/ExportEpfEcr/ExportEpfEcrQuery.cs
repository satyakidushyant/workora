using System.Text;
using MediatR;
using Workora.Application.Features.Compliance.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Compliance.Queries.ExportEpfEcr;

/// <summary>
/// Query to generate standard EPF Unified Portal ECR (Electronic Challan cum Return) text file.
/// </summary>
public record ExportEpfEcrQuery(int Month, int Year, int? CompanyId) : IRequest<ApiResponse<StatutoryExportFileDto>>;
