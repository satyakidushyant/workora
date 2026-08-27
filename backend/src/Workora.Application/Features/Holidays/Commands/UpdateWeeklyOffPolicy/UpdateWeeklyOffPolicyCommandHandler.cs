using MediatR;
using Workora.Application.Features.Holidays.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Holidays.Commands.UpdateWeeklyOffPolicy;

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
