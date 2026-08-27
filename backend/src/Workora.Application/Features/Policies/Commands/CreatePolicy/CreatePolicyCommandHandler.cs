using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Policies.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Policies.Commands.CreatePolicy;

/// <summary>
/// Handler for <see cref="CreatePolicyCommand"/>.
/// </summary>
public class CreatePolicyCommandHandler : IRequestHandler<CreatePolicyCommand, ApiResponse<PolicyDto>>
{
    private readonly IPolicyRepository _policyRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreatePolicyCommandHandler"/> class.
    /// </summary>
    public CreatePolicyCommandHandler(
        IPerformanceRepository? performanceRepository,
        IPolicyRepository policyRepository,
        ICompanyRepository companyRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _policyRepository = policyRepository;
        _companyRepository = companyRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PolicyDto>> Handle(CreatePolicyCommand request, CancellationToken ct)
    {
        var company = await _companyRepository.GetByIdAsync(request.CompanyId, ct);
        if (company == null)
        {
            return ApiResponse<PolicyDto>.Fail(ResponseMessage.CompanyNotFound.GetDescription());
        }

        var policy = Policy.Create(
            request.CompanyId,
            request.Title,
            request.Content,
            request.Version,
            request.EffectiveDate,
            request.RequiresAcknowledgment);

        await _policyRepository.AddAsync(policy, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<PolicyDto>(policy);
        return ApiResponse<PolicyDto>.Success(dto, ResponseMessage.PolicyCreated.GetDescription());
    }
}
