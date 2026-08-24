using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Assets.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Assets.Commands.CreateAsset;

/// <summary>
/// Command to create a new asset inventory record.
/// </summary>
public record CreateAssetCommand(
    int CompanyId,
    string Name,
    string AssetTag,
    string Category,
    string? SerialNumber,
    decimal? PurchaseCost,
    DateOnly? PurchaseDate) : IRequest<ApiResponse<AssetDto>>;

/// <summary>
/// Validator for <see cref="CreateAssetCommand"/>.
/// </summary>
public class CreateAssetCommandValidator : AbstractValidator<CreateAssetCommand>
{
    /// <summary>
    /// Initializes validation rules for creating an asset.
    /// </summary>
    public CreateAssetCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150).WithMessage("Asset name is required.");
        RuleFor(x => x.AssetTag).NotEmpty().MaximumLength(50).WithMessage("Asset tag is required.");
        RuleFor(x => x.Category).NotEmpty().MaximumLength(100).WithMessage("Category is required.");
    }
}

/// <summary>
/// Handler for <see cref="CreateAssetCommand"/>.
/// </summary>
public class CreateAssetCommandHandler : IRequestHandler<CreateAssetCommand, ApiResponse<AssetDto>>
{
    private readonly IAssetRepository _assetRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateAssetCommandHandler"/> class.
    /// </summary>
    public CreateAssetCommandHandler(
        IAssetRepository assetRepository,
        ICompanyRepository companyRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _assetRepository = assetRepository;
        _companyRepository = companyRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<AssetDto>> Handle(CreateAssetCommand request, CancellationToken ct)
    {
        var company = await _companyRepository.GetByIdAsync(request.CompanyId, ct);
        if (company == null)
        {
            return ApiResponse<AssetDto>.Fail(ResponseMessage.CompanyNotFound.GetDescription());
        }

        var asset = Asset.Create(
            request.CompanyId,
            request.Name,
            request.AssetTag,
            request.Category,
            request.SerialNumber,
            request.PurchaseCost,
            request.PurchaseDate);

        await _assetRepository.AddAsync(asset, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<AssetDto>(asset);
        return ApiResponse<AssetDto>.Success(dto, ResponseMessage.AssetCreated.GetDescription());
    }
}
