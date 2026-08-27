using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Onboarding.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Onboarding.Commands.CreateOnboardingChecklist;

/// <summary>
/// Handler for <see cref="CreateOnboardingChecklistCommand"/>.
/// </summary>
public class CreateOnboardingChecklistCommandHandler : IRequestHandler<CreateOnboardingChecklistCommand, ApiResponse<OnboardingChecklistDto>>
{
    private readonly IOnboardingRepository _onboardingRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateOnboardingChecklistCommandHandler"/> class.
    /// </summary>
    public CreateOnboardingChecklistCommandHandler(
        IOnboardingRepository onboardingRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _onboardingRepository = onboardingRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<OnboardingChecklistDto>> Handle(CreateOnboardingChecklistCommand request, CancellationToken ct)
    {
        var checklist = OnboardingChecklist.Create(request.TaskName, request.AssignedRole, request.IsMandatory);
        await _onboardingRepository.AddAsync(checklist, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<OnboardingChecklistDto>(checklist);
        return ApiResponse<OnboardingChecklistDto>.Success(dto, ResponseMessage.Created.GetDescription());
    }
}
