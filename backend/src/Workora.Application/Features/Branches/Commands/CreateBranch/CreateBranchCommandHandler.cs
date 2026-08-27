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
