using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Branches.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Branches.Commands.UpdateBranch;

/// <summary>
/// Command to update an existing branch.
/// </summary>
public record UpdateBranchCommand(
    int Id,
    string Name,
    string Code,
    string Location,
    string? Address,
    string Timezone,
    bool IsHeadOffice) : IRequest<ApiResponse<BranchDto>>;

/// <summary>
/// Validator for <see cref="UpdateBranchCommand"/>.
/// </summary>
public class UpdateBranchCommandValidator : AbstractValidator<UpdateBranchCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="UpdateBranchCommand"/>.
    /// </summary>
    public UpdateBranchCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid branch ID is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200).WithMessage("Branch name is required.");
        RuleFor(x => x.Code).NotEmpty().MaximumLength(50).WithMessage("Branch code is required.");
        RuleFor(x => x.Location).NotEmpty().MaximumLength(200).WithMessage("Location is required.");
    }
}

/// <summary>
/// Handler for <see cref="UpdateBranchCommand"/>.
/// </summary>
public class UpdateBranchCommandHandler : IRequestHandler<UpdateBranchCommand, ApiResponse<BranchDto>>
{
    private readonly IBranchRepository _branchRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateBranchCommandHandler"/> class.
    /// </summary>
    public UpdateBranchCommandHandler(
        IBranchRepository branchRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _branchRepository = branchRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<BranchDto>> Handle(UpdateBranchCommand request, CancellationToken ct)
    {
        var branch = await _branchRepository.GetByIdAsync(request.Id, ct);
        if (branch == null)
        {
            return ApiResponse<BranchDto>.Fail(ResponseMessage.BranchNotFound.GetDescription());
        }

        var isUnique = await _branchRepository.IsCodeUniqueAsync(branch.CompanyId, request.Code, request.Id, ct);
        if (!isUnique)
        {
            return ApiResponse<BranchDto>.Fail("A branch with this code already exists for this company.");
        }

        branch.Update(
            request.Name,
            request.Code,
            request.Location,
            request.Address,
            request.Timezone,
            request.IsHeadOffice);

        _branchRepository.Update(branch);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<BranchDto>(branch);
        return ApiResponse<BranchDto>.Success(dto, ResponseMessage.BranchUpdated.GetDescription());
    }
}
