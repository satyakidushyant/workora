using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Commands.UpdateGoalProgress;

/// <summary>
/// Handler for <see cref="UpdateGoalProgressCommand"/>.
/// </summary>
public class UpdateGoalProgressCommandHandler : IRequestHandler<UpdateGoalProgressCommand, ApiResponse<GoalDto>>
{
    private readonly IPerformanceRepository _performanceRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateGoalProgressCommandHandler"/> class.
    /// </summary>
    public UpdateGoalProgressCommandHandler(
        IPerformanceRepository performanceRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _performanceRepository = performanceRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<GoalDto>> Handle(UpdateGoalProgressCommand request, CancellationToken ct)
    {
        var goal = await _performanceRepository.GetGoalByIdAsync(request.Id, ct);
        if (goal == null)
        {
            return ApiResponse<GoalDto>.Fail(ResponseMessage.GoalNotFound.GetDescription());
        }

        goal.UpdateProgress(request.ProgressPercentage, request.Status);
        _performanceRepository.UpdateGoal(goal);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<GoalDto>(goal);
        return ApiResponse<GoalDto>.Success(dto, ResponseMessage.GoalProgressUpdated.GetDescription());
    }
}
