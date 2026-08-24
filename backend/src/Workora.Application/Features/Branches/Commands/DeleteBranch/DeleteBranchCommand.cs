using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Branches.Commands.DeleteBranch;

/// <summary>
/// Command to delete a branch.
/// </summary>
public record DeleteBranchCommand(int Id) : IRequest<ApiResponse<bool>>;

/// <summary>
/// Handler for <see cref="DeleteBranchCommand"/>.
/// </summary>
public class DeleteBranchCommandHandler : IRequestHandler<DeleteBranchCommand, ApiResponse<bool>>
{
    private readonly IBranchRepository _branchRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="DeleteBranchCommandHandler"/> class.
    /// </summary>
    public DeleteBranchCommandHandler(IBranchRepository branchRepository, IUnitOfWork unitOfWork)
    {
        _branchRepository = branchRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(DeleteBranchCommand request, CancellationToken ct)
    {
        var branch = await _branchRepository.GetByIdAsync(request.Id, ct);
        if (branch == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.BranchNotFound.GetDescription());
        }

        _branchRepository.Remove(branch);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true, ResponseMessage.BranchDeleted.GetDescription());
    }
}
