using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Application.Features.Holidays.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Holidays.Queries.GetWeeklyOffPolicy;

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

        return ApiResponse<WeeklyOffPolicyDto>.Success(dto, ResponseMessage.WeeklyOffPolicyRetrieved.GetDescription());
    }
}
