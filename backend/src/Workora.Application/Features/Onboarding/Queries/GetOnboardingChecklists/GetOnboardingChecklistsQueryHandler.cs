using AutoMapper;
using MediatR;
using Workora.Application.Features.Onboarding.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Onboarding.Queries.GetOnboardingChecklists;

/// <summary>
/// Handler for <see cref="GetOnboardingChecklistsQuery"/>.
/// </summary>
public class GetOnboardingChecklistsQueryHandler : IRequestHandler<GetOnboardingChecklistsQuery, ApiResponse<IReadOnlyList<OnboardingChecklistDto>>>
{
    private readonly IOnboardingRepository _onboardingRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetOnboardingChecklistsQueryHandler"/> class.
    /// </summary>
    public GetOnboardingChecklistsQueryHandler(IOnboardingRepository onboardingRepository, IMapper mapper)
    {
        _onboardingRepository = onboardingRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<OnboardingChecklistDto>>> Handle(GetOnboardingChecklistsQuery request, CancellationToken ct)
    {
        var checklists = await _onboardingRepository.GetChecklistsAsync(ct);
        var dtos = _mapper.Map<IReadOnlyList<OnboardingChecklistDto>>(checklists);
        return ApiResponse<IReadOnlyList<OnboardingChecklistDto>>.Success(dtos);
    }
}
