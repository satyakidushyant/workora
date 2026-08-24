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
/// Command to update the progress percentage and status of a goal.
/// </summary>
public record UpdateGoalProgressCommand(
    int Id,
    int ProgressPercentage,
    GoalStatus Status) : IRequest<ApiResponse<GoalDto>>;

/// <summary>
/// Validator for <see cref="UpdateGoalProgressCommand"/>.
/// </summary>
public class UpdateGoalProgressCommandValidator : AbstractValidator<UpdateGoalProgressCommand>
{
    /// <summary>
    /// Initializes validation rules for updating goal progress.
    /// </summary>
    public UpdateGoalProgressCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid goal ID is required.");
        RuleFor(x => x.ProgressPercentage).InclusiveBetween(0, 100).WithMessage("Progress percentage must be between 0 and 100.");
    }
}

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
