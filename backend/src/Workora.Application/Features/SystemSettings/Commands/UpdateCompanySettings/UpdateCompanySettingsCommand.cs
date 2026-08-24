using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.SystemSettings.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SystemSettings.Commands.UpdateCompanySettings;

/// <summary>
/// Command to update batch system configuration settings for a company.
/// </summary>
public record UpdateCompanySettingsCommand(
    int CompanyId,
    IReadOnlyList<SettingItemDto> Settings) : IRequest<ApiResponse<IReadOnlyList<SystemSettingDto>>>;

/// <summary>
/// Validator for <see cref="UpdateCompanySettingsCommand"/>.
/// </summary>
public class UpdateCompanySettingsCommandValidator : AbstractValidator<UpdateCompanySettingsCommand>
{
    /// <summary>
    /// Initializes validation rules for settings updates.
    /// </summary>
    public UpdateCompanySettingsCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.Settings).NotEmpty().WithMessage("At least one setting parameter is required.");
    }
}

/// <summary>
/// Handler for <see cref="UpdateCompanySettingsCommand"/>.
/// </summary>
public class UpdateCompanySettingsCommandHandler : IRequestHandler<UpdateCompanySettingsCommand, ApiResponse<IReadOnlyList<SystemSettingDto>>>
{
    private readonly ISystemSettingRepository _systemSettingRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateCompanySettingsCommandHandler"/> class.
    /// </summary>
    public UpdateCompanySettingsCommandHandler(
        ISystemSettingRepository systemSettingRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _systemSettingRepository = systemSettingRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<SystemSettingDto>>> Handle(UpdateCompanySettingsCommand request, CancellationToken ct)
    {
        foreach (var item in request.Settings)
        {
            await _systemSettingRepository.UpsertSettingAsync(
                request.CompanyId,
                item.Key,
                item.Value,
                item.Description,
                item.Group,
                ct);
        }

        await _unitOfWork.SaveChangesAsync(ct);

        var updated = await _systemSettingRepository.GetCompanySettingsAsync(request.CompanyId, null, ct);
        var dtos = _mapper.Map<IReadOnlyList<SystemSettingDto>>(updated);
        return ApiResponse<IReadOnlyList<SystemSettingDto>>.Success(dtos, ResponseMessage.SystemSettingUpdated.GetDescription());
    }
}
