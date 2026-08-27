using AutoMapper;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Features.Branches.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Branches.Queries.GetBranchById;

/// <summary>
/// Handler for <see cref="GetBranchByIdQuery"/>.
/// </summary>
public class GetBranchByIdQueryHandler : IRequestHandler<GetBranchByIdQuery, ApiResponse<BranchDto>>
{
    private readonly IBranchRepository _branchRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetBranchByIdQueryHandler"/> class.
    /// </summary>
    public GetBranchByIdQueryHandler(IBranchRepository branchRepository, IMapper mapper)
    {
        _branchRepository = branchRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<BranchDto>> Handle(GetBranchByIdQuery request, CancellationToken ct)
    {
        var branch = await _branchRepository.GetByIdAsync(request.Id, ct);
        if (branch == null)
        {
            return ApiResponse<BranchDto>.Fail(ResponseMessage.BranchNotFound.GetDescription());
        }

        var dto = _mapper.Map<BranchDto>(branch);
        return ApiResponse<BranchDto>.Success(dto);
    }
}
