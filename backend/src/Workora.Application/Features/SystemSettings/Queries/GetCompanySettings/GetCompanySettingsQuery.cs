using AutoMapper;
using MediatR;
using Workora.Application.Features.SystemSettings.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SystemSettings.Queries.GetCompanySettings;

/// <summary>
/// Query to list all system configuration settings for a company.
/// </summary>
public record GetCompanySettingsQuery(
    int CompanyId,
    string? Group = null) : IRequest<ApiResponse<IReadOnlyList<SystemSettingDto>>>;

/// <summary>
/// Handler for <see cref="GetCompanySettingsQuery"/>.
/// </summary>
public class GetCompanySettingsQueryHandler : IRequestHandler<GetCompanySettingsQuery, ApiResponse<IReadOnlyList<SystemSettingDto>>>
{
    private readonly ISystemSettingRepository _systemSettingRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetCompanySettingsQueryHandler"/> class.
    /// </summary>
    public GetCompanySettingsQueryHandler(ISystemSettingRepository systemSettingRepository, IMapper mapper)
    {
        _systemSettingRepository = systemSettingRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<SystemSettingDto>>> Handle(GetCompanySettingsQuery request, CancellationToken ct)
    {
        var settings = await _systemSettingRepository.GetCompanySettingsAsync(request.CompanyId, request.Group, ct);
        var dtos = _mapper.Map<IReadOnlyList<SystemSettingDto>>(settings);
        return ApiResponse<IReadOnlyList<SystemSettingDto>>.Success(dtos);
    }
}
