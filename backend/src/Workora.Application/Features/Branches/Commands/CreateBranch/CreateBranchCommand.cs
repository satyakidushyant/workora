using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Branches.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Branches.Commands.CreateBranch;

/// <summary>
/// Command to create a new branch.
/// </summary>
public record CreateBranchCommand(
    int CompanyId,
    string Name,
    string Code,
    string Location,
    string? Address,
    string Timezone,
    bool IsHeadOffice) : IRequest<ApiResponse<BranchDto>>;

/// <summary>
/// Validator for <see cref="CreateBranchCommand"/>.
/// </summary>
public class CreateBranchCommandValidator : AbstractValidator<CreateBranchCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="CreateBranchCommand"/>.
    /// </summary>
    public CreateBranchCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200).WithMessage("Branch name is required and cannot exceed 200 characters.");
        RuleFor(x => x.Code).NotEmpty().MaximumLength(50).WithMessage("Branch code is required and cannot exceed 50 characters.");
        RuleFor(x => x.Location).NotEmpty().MaximumLength(200).WithMessage("Location is required.");
    }
}

/// <summary>
/// Handler for <see cref="CreateBranchCommand"/>.
/// </summary>
public class CreateBranchCommandHandler : IRequestHandler<CreateBranchCommand, ApiResponse<BranchDto>>
{
    private readonly IBranchRepository _branchRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateBranchCommandHandler"/> class.
    /// </summary>
    public CreateBranchCommandHandler(
        IBranchRepository branchRepository,
        ICompanyRepository companyRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _branchRepository = branchRepository;
        _companyRepository = companyRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<BranchDto>> Handle(CreateBranchCommand request, CancellationToken ct)
    {
        var company = await _companyRepository.GetByIdAsync(request.CompanyId, ct);
        if (company == null)
        {
            return ApiResponse<BranchDto>.Fail(ResponseMessage.CompanyNotFound.GetDescription());
        }

        var isUnique = await _branchRepository.IsCodeUniqueAsync(request.CompanyId, request.Code, null, ct);
        if (!isUnique)
        {
            return ApiResponse<BranchDto>.Fail("A branch with this code already exists for this company.");
        }

        var branch = Branch.Create(
            request.CompanyId,
            request.Name,
            request.Code,
            request.Location,
            request.Address,
            request.Timezone,
            request.IsHeadOffice);

        await _branchRepository.AddAsync(branch, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<BranchDto>(branch);
        return ApiResponse<BranchDto>.Success(dto, ResponseMessage.BranchCreated.GetDescription());
    }
}
