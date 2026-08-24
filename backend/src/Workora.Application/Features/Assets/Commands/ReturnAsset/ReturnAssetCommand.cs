using FluentValidation;
using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Assets.Commands.ReturnAsset;

/// <summary>
/// Command to return an assigned asset back to company inventory.
/// </summary>
public record ReturnAssetCommand(
    int AssetId,
    DateOnly ReturnedDate,
    string? Condition = null) : IRequest<ApiResponse<bool>>;

/// <summary>
/// Validator for <see cref="ReturnAssetCommand"/>.
/// </summary>
public class ReturnAssetCommandValidator : AbstractValidator<ReturnAssetCommand>
{
    /// <summary>
    /// Initializes validation rules for returning an asset.
    /// </summary>
    public ReturnAssetCommandValidator()
    {
        RuleFor(x => x.AssetId).GreaterThan(0).WithMessage("Valid asset ID is required.");
    }
}

/// <summary>
/// Handler for <see cref="ReturnAssetCommand"/>.
/// </summary>
public class ReturnAssetCommandHandler : IRequestHandler<ReturnAssetCommand, ApiResponse<bool>>
{
    private readonly IAssetRepository _assetRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="ReturnAssetCommandHandler"/> class.
    /// </summary>
    public ReturnAssetCommandHandler(IAssetRepository assetRepository, IUnitOfWork unitOfWork)
    {
        _assetRepository = assetRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(ReturnAssetCommand request, CancellationToken ct)
    {
        var asset = await _assetRepository.GetByIdAsync(request.AssetId, ct);
        if (asset == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.AssetNotFound.GetDescription());
        }

        var activeAssignment = await _assetRepository.GetActiveAssignmentAsync(request.AssetId, ct);
        if (activeAssignment == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.AssetNotAssigned.GetDescription());
        }

        activeAssignment.MarkReturned(request.ReturnedDate, request.Condition);
        _assetRepository.UpdateAssignment(activeAssignment);

        asset.Return();
        _assetRepository.Update(asset);

        await _unitOfWork.SaveChangesAsync(ct);
        return ApiResponse<bool>.Success(true, ResponseMessage.AssetReturned.GetDescription());
    }
}
