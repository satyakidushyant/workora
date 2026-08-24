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
/// Command to create a new corporate policy document.
/// </summary>
public record CreatePolicyCommand(
    int CompanyId,
    string Title,
    string Content,
    string Version,
    DateOnly EffectiveDate,
    bool RequiresAcknowledgment = true) : IRequest<ApiResponse<PolicyDto>>;

/// <summary>
/// Validator for <see cref="CreatePolicyCommand"/>.
/// </summary>
public class CreatePolicyCommandValidator : AbstractValidator<CreatePolicyCommand>
{
    /// <summary>
    /// Initializes validation rules for policy creation.
    /// </summary>
    public CreatePolicyCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200).WithMessage("Title is required.");
        RuleFor(x => x.Content).NotEmpty().WithMessage("Policy content is required.");
        RuleFor(x => x.Version).NotEmpty().MaximumLength(50).WithMessage("Version string is required.");
    }
}

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
