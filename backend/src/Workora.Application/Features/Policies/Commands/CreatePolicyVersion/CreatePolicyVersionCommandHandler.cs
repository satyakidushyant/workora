using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Application.Features.Policies.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Policies.Commands.CreatePolicyVersion;

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
            return ApiResponse<PolicyDto>.Fail(ResponseMessage.PolicyNotFound.GetDescription());
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

        return ApiResponse<PolicyDto>.Success(dto, ResponseMessage.PolicyVersionPublished.GetDescription());
    }
}
