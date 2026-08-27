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
