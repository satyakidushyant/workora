using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.Holidays.WeeklyOffs;

/// <summary>
/// DTO representing company weekly-off policy details.
/// </summary>
public class WeeklyOffPolicyDto
{
    /// <summary>
    /// Gets or sets company identifier.
    /// </summary>
    public int CompanyId { get; set; }

    /// <summary>
    /// Gets or sets comma-separated weekly off days (e.g., "Saturday,Sunday").
    /// </summary>
    public string WeeklyOffDays { get; set; } = "Sunday";

    /// <summary>
    /// Gets or sets a value indicating whether alternate Saturdays are designated off.
    /// </summary>
    public bool AlternateSaturdayOff { get; set; }
}

/// <summary>
/// Query to fetch weekly-off policy for a company.
/// </summary>
public record GetWeeklyOffPolicyQuery(int CompanyId) : IRequest<ApiResponse<WeeklyOffPolicyDto>>;

/// <summary>
/// Handler for <see cref="GetWeeklyOffPolicyQuery"/>.
/// </summary>
public class GetWeeklyOffPolicyQueryHandler : IRequestHandler<GetWeeklyOffPolicyQuery, ApiResponse<WeeklyOffPolicyDto>>
{
    private readonly IGenericRepository<SystemSetting> _settingRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetWeeklyOffPolicyQueryHandler"/> class.
    /// </summary>
    public GetWeeklyOffPolicyQueryHandler(IGenericRepository<SystemSetting> settingRepository)
    {
        _settingRepository = settingRepository;
    }

    /// <summary>
    /// Handles retrieval of weekly off policy setting.
    /// </summary>
    public async Task<ApiResponse<WeeklyOffPolicyDto>> Handle(GetWeeklyOffPolicyQuery request, CancellationToken cancellationToken)
    {
        var setting = await _settingRepository.GetFirstOrDefaultAsync(
            s => s.CompanyId == request.CompanyId && s.Key == "WeeklyOffPolicy", cancellationToken);

        var dto = new WeeklyOffPolicyDto
        {
            CompanyId = request.CompanyId,
            WeeklyOffDays = setting?.Value ?? "Sunday",
            AlternateSaturdayOff = setting?.Value?.Contains("AlternateSaturday") ?? false
        };

        return ApiResponse<WeeklyOffPolicyDto>.Success(dto, "Weekly off policy retrieved successfully.");
    }
}

/// <summary>
/// Command to update weekly off policy.
/// </summary>
public record UpdateWeeklyOffPolicyCommand(
    int CompanyId,
    string WeeklyOffDays,
    bool AlternateSaturdayOff) : IRequest<ApiResponse<WeeklyOffPolicyDto>>;

/// <summary>
/// Validator for <see cref="UpdateWeeklyOffPolicyCommand"/>.
/// </summary>
public class UpdateWeeklyOffPolicyCommandValidator : AbstractValidator<UpdateWeeklyOffPolicyCommand>
{
    /// <summary>
    /// Initializes validation rules for UpdateWeeklyOffPolicyCommand.
    /// </summary>
    public UpdateWeeklyOffPolicyCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0);
        RuleFor(x => x.WeeklyOffDays).NotEmpty().WithMessage("Weekly off days setting is required.");
    }
}

/// <summary>
/// Handler for <see cref="UpdateWeeklyOffPolicyCommandHandler"/>.
/// </summary>
public class UpdateWeeklyOffPolicyCommandHandler : IRequestHandler<UpdateWeeklyOffPolicyCommand, ApiResponse<WeeklyOffPolicyDto>>
{
    private readonly IGenericRepository<SystemSetting> _settingRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateWeeklyOffPolicyCommandHandler"/> class.
    /// </summary>
    public UpdateWeeklyOffPolicyCommandHandler(
        IGenericRepository<SystemSetting> settingRepository,
        IUnitOfWork unitOfWork)
    {
        _settingRepository = settingRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Executes updating weekly off policy setting.
    /// </summary>
    public async Task<ApiResponse<WeeklyOffPolicyDto>> Handle(UpdateWeeklyOffPolicyCommand request, CancellationToken cancellationToken)
    {
        var setting = await _settingRepository.GetFirstOrDefaultAsync(
            s => s.CompanyId == request.CompanyId && s.Key == "WeeklyOffPolicy", cancellationToken);

        var val = request.AlternateSaturdayOff ? $"{request.WeeklyOffDays},AlternateSaturday" : request.WeeklyOffDays;

        if (setting == null)
        {
            setting = SystemSetting.Create(request.CompanyId, "WeeklyOffPolicy", val, "Weekly Off Policy Configuration");
            await _settingRepository.AddAsync(setting, cancellationToken);
        }
        else
        {
            setting.UpdateValue(val);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var dto = new WeeklyOffPolicyDto
        {
            CompanyId = request.CompanyId,
            WeeklyOffDays = request.WeeklyOffDays,
            AlternateSaturdayOff = request.AlternateSaturdayOff
        };

        return ApiResponse<WeeklyOffPolicyDto>.Success(dto, "Weekly off policy updated successfully.");
    }
}
