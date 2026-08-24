using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Designations.Commands.DeleteDesignation;

/// <summary>
/// Command to delete a designation.
/// </summary>
public record DeleteDesignationCommand(int Id) : IRequest<ApiResponse<bool>>;

/// <summary>
/// Handler for <see cref="DeleteDesignationCommand"/>.
/// </summary>
public class DeleteDesignationCommandHandler : IRequestHandler<DeleteDesignationCommand, ApiResponse<bool>>
{
    private readonly IDesignationRepository _designationRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="DeleteDesignationCommandHandler"/> class.
    /// </summary>
    public DeleteDesignationCommandHandler(IDesignationRepository designationRepository, IUnitOfWork unitOfWork)
    {
        _designationRepository = designationRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(DeleteDesignationCommand request, CancellationToken ct)
    {
        var designation = await _designationRepository.GetByIdAsync(request.Id, ct);
        if (designation == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.DesignationNotFound.GetDescription());
        }

        _designationRepository.Remove(designation);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true, ResponseMessage.DesignationDeleted.GetDescription());
    }
}
