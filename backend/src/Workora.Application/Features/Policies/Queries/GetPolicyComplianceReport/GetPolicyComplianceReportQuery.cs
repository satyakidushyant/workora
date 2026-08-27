using MediatR;
using Workora.Application.Features.Policies.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Policies.Queries.GetPolicyComplianceReport;

/// <summary>
/// Query to get policy compliance acknowledgment audit report.
/// </summary>
public record GetPolicyComplianceReportQuery(int PolicyId) : IRequest<ApiResponse<PolicyComplianceAuditDto>>;
