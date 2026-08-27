using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Application.Features.Policies.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Policies.Queries.GetPolicyComplianceReport;

/// <summary>
/// Handler for <see cref="GetPolicyComplianceReportQuery"/>.
/// </summary>
public class GetPolicyComplianceReportQueryHandler : IRequestHandler<GetPolicyComplianceReportQuery, ApiResponse<PolicyComplianceAuditDto>>
{
    private readonly IGenericRepository<Policy> _policyRepository;
    private readonly IGenericRepository<PolicyAcknowledgment> _ackRepository;
    private readonly IGenericRepository<Employee> _employeeRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetPolicyComplianceReportQueryHandler"/> class.
    /// </summary>
    public GetPolicyComplianceReportQueryHandler(
        IGenericRepository<Policy> policyRepository,
        IGenericRepository<PolicyAcknowledgment> ackRepository,
        IGenericRepository<Employee> employeeRepository)
    {
        _policyRepository = policyRepository;
        _ackRepository = ackRepository;
        _employeeRepository = employeeRepository;
    }

    /// <summary>
    /// Executes calculation of policy acknowledgment compliance report.
    /// </summary>
    public async Task<ApiResponse<PolicyComplianceAuditDto>> Handle(GetPolicyComplianceReportQuery request, CancellationToken cancellationToken)
    {
        var policy = await _policyRepository.GetByIdAsync(request.PolicyId, cancellationToken);
        if (policy == null)
        {
            return ApiResponse<PolicyComplianceAuditDto>.Fail(ResponseMessage.PolicyNotFound.GetDescription());
        }

        var totalEmployees = _employeeRepository.GetQueryable().Count(e => e.IsActive);
        var ackCount = _ackRepository.GetQueryable().Count(a => a.PolicyId == policy.Id);

        var percentage = totalEmployees > 0 ? Math.Round((decimal)ackCount / totalEmployees * 100, 2) : 100;

        var dto = new PolicyComplianceAuditDto
        {
            PolicyId = policy.Id,
            PolicyTitle = policy.Title,
            TotalEmployees = totalEmployees,
            AcknowledgedCount = ackCount,
            CompliancePercentage = percentage
        };

        return ApiResponse<PolicyComplianceAuditDto>.Success(dto, ResponseMessage.PolicyComplianceReportCalculated.GetDescription());
    }
}
