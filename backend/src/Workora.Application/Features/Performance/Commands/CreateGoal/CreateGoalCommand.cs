using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Commands.CreateGoal;

/// <summary>
/// Command to create a performance goal / KPI for an employee.
/// </summary>
public record CreateGoalCommand(
    int EmployeeId,
    string Title,
    string Description,
    DateOnly TargetDate) : IRequest<ApiResponse<GoalDto>>;

/// <summary>
/// Validator for <see cref="CreateGoalCommand"/>.
/// </summary>
public class CreateGoalCommandValidator : AbstractValidator<CreateGoalCommand>
{
    /// <summary>
    /// Initializes validation rules for creating goals.
    /// </summary>
    public CreateGoalCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid employee ID is required.");
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200).WithMessage("Title is required.");
        RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required.");
    }
}

/// <summary>
/// Handler for <see cref="CreateGoalCommand"/>.
/// </summary>
public class CreateGoalCommandHandler : IRequestHandler<CreateGoalCommand, ApiResponse<GoalDto>>
{
    private readonly IPerformanceRepository _performanceRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateGoalCommandHandler"/> class.
    /// </summary>
    public CreateGoalCommandHandler(
        IPerformanceRepository performanceRepository,
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _performanceRepository = performanceRepository;
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<GoalDto>> Handle(CreateGoalCommand request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetByIdAsync(request.EmployeeId, ct);
        if (employee == null)
        {
            return ApiResponse<GoalDto>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        var goal = Goal.Create(request.EmployeeId, request.Title, request.Description, request.TargetDate);
        await _performanceRepository.AddGoalAsync(goal, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var loaded = await _performanceRepository.GetGoalByIdAsync(goal.Id, ct);
        var dto = _mapper.Map<GoalDto>(loaded ?? goal);
        return ApiResponse<GoalDto>.Success(dto, ResponseMessage.GoalCreated.GetDescription());
    }
}
