using FluentValidation;
using MediatR;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Assets.Commands.AssignAsset;

/// <summary>
/// Command to assign an asset to an employee.
/// </summary>
public record AssignAssetCommand(
    int AssetId,
    int EmployeeId,
    DateOnly AssignedDate) : IRequest<ApiResponse<bool>>;

/// <summary>
/// Validator for <see cref="AssignAssetCommand"/>.
/// </summary>
public class AssignAssetCommandValidator : AbstractValidator<AssignAssetCommand>
{
    /// <summary>
    /// Initializes validation rules for assigning an asset.
    /// </summary>
    public AssignAssetCommandValidator()
    {
        RuleFor(x => x.AssetId).GreaterThan(0).WithMessage("Valid asset ID is required.");
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid employee ID is required.");
    }
}

/// <summary>
/// Handler for <see cref="AssignAssetCommand"/>.
/// </summary>
public class AssignAssetCommandHandler : IRequestHandler<AssignAssetCommand, ApiResponse<bool>>
{
    private readonly IAssetRepository _assetRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="AssignAssetCommandHandler"/> class.
    /// </summary>
    public AssignAssetCommandHandler(
        IAssetRepository assetRepository,
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork)
    {
        _assetRepository = assetRepository;
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(AssignAssetCommand request, CancellationToken ct)
    {
        var asset = await _assetRepository.GetByIdAsync(request.AssetId, ct);
        if (asset == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.AssetNotFound.GetDescription());
        }

        if (asset.Status != AssetStatus.Available)
        {
            return ApiResponse<bool>.Fail($"Asset is currently {asset.Status} and cannot be assigned.");
        }

        var employee = await _employeeRepository.GetByIdAsync(request.EmployeeId, ct);
        if (employee == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        var assignment = AssetAssignment.Create(request.AssetId, request.EmployeeId, request.AssignedDate);
        await _assetRepository.AddAssignmentAsync(assignment, ct);

        asset.Assign();
        _assetRepository.Update(asset);

        await _unitOfWork.SaveChangesAsync(ct);
        return ApiResponse<bool>.Success(true, ResponseMessage.AssetAssigned.GetDescription());
    }
}
