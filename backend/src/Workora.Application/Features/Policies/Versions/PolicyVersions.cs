using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Application.Features.Policies.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.Policies.Versions;

/// <summary>
/// DTO representing policy compliance acknowledgment audit stats.
/// </summary>
public class PolicyComplianceAuditDto
{
    /// <summary>
    /// Gets or sets policy ID.
    /// </summary>
    public int PolicyId { get; set; }

    /// <summary>
    /// Gets or sets policy title.
    /// </summary>
    public string PolicyTitle { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets total required employees.
    /// </summary>
    public int TotalEmployees { get; set; }

    /// <summary>
    /// Gets or sets count of acknowledged employees.
    /// </summary>
    public int AcknowledgedCount { get; set; }

    /// <summary>
    /// Gets or sets compliance percentage (0 to 100).
    /// </summary>
    public decimal CompliancePercentage { get; set; }
}

/// <summary>
/// Command to publish a new version of an existing policy.
/// </summary>
public record CreatePolicyVersionCommand(
    int PolicyId,
    string VersionNumber,
    string Content,
    string ChangeSummary) : IRequest<ApiResponse<PolicyDto>>;

/// <summary>
/// Handler for <see cref="CreatePolicyVersionCommand"/>.
/// </summary>
public class CreatePolicyVersionCommandHandler : IRequestHandler<CreatePolicyVersionCommand, ApiResponse<PolicyDto>>
{
    private readonly IGenericRepository<Policy> _policyRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreatePolicyVersionCommandHandler"/> class.
    /// </summary>
    public CreatePolicyVersionCommandHandler(
        IGenericRepository<Policy> policyRepository,
        IUnitOfWork unitOfWork)
    {
        _policyRepository = policyRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Executes creating and publishing new policy version.
    /// </summary>
    public async Task<ApiResponse<PolicyDto>> Handle(CreatePolicyVersionCommand request, CancellationToken cancellationToken)
    {
        var policy = await _policyRepository.GetByIdAsync(request.PolicyId, cancellationToken);
        if (policy == null)
        {
            return ApiResponse<PolicyDto>.Fail($"Policy {request.PolicyId} not found.");
        }

        var newPolicy = Policy.Create(
            policy.CompanyId,
            policy.Title,
            request.Content,
            request.VersionNumber,
            policy.EffectiveDate,
            policy.RequiresAcknowledgment);

        await _policyRepository.AddAsync(newPolicy, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var dto = new PolicyDto(
            newPolicy.Id,
            newPolicy.Uuid,
            newPolicy.CompanyId,
            newPolicy.Title,
            newPolicy.Content,
            newPolicy.Version,
            newPolicy.EffectiveDate,
            newPolicy.RequiresAcknowledgment,
            0,
            newPolicy.IsActive,
            newPolicy.CreatedAt);

        return ApiResponse<PolicyDto>.Success(dto, $"Policy version {request.VersionNumber} published successfully.");
    }
}

/// <summary>
/// Query to get policy compliance acknowledgment audit report.
/// </summary>
public record GetPolicyComplianceReportQuery(int PolicyId) : IRequest<ApiResponse<PolicyComplianceAuditDto>>;

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
            return ApiResponse<PolicyComplianceAuditDto>.Fail($"Policy {request.PolicyId} not found.");
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

        return ApiResponse<PolicyComplianceAuditDto>.Success(dto, "Policy compliance audit report calculated successfully.");
    }
}
