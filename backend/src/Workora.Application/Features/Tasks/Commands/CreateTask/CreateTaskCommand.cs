using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Tasks.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Tasks.Commands.CreateTask;

/// <summary>
/// Command to create a new task.
/// </summary>
public record CreateTaskCommand(
    int CompanyId,
    string Title,
    string? Description,
    int AssignedToEmployeeId,
    int CreatedByEmployeeId,
    TaskPriority Priority,
    DateOnly DueDate) : IRequest<ApiResponse<TaskItemDto>>;

/// <summary>
/// Validator for <see cref="CreateTaskCommand"/>.
/// </summary>
public class CreateTaskCommandValidator : AbstractValidator<CreateTaskCommand>
{
    /// <summary>
    /// Initializes validation rules.
    /// </summary>
    public CreateTaskCommandValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200).WithMessage("Task title is required.");
        RuleFor(x => x.AssignedToEmployeeId).GreaterThan(0).WithMessage("Valid assignee employee ID is required.");
        RuleFor(x => x.CreatedByEmployeeId).GreaterThan(0).WithMessage("Valid creator employee ID is required.");
    }
}

/// <summary>
/// Handler for <see cref="CreateTaskCommand"/>.
/// </summary>
public class CreateTaskCommandHandler : IRequestHandler<CreateTaskCommand, ApiResponse<TaskItemDto>>
{
    private readonly ITaskItemRepository _taskRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public CreateTaskCommandHandler(
        ITaskItemRepository taskRepository,
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _taskRepository = taskRepository;
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<TaskItemDto>> Handle(CreateTaskCommand request, CancellationToken ct)
    {
        var assignee = await _employeeRepository.GetByIdAsync(request.AssignedToEmployeeId, ct);
        if (assignee == null)
        {
            return ApiResponse<TaskItemDto>.Fail("Assignee employee not found.");
        }

        var task = TaskItem.Create(
            request.CompanyId,
            request.Title,
            request.Description,
            request.AssignedToEmployeeId,
            request.CreatedByEmployeeId,
            request.Priority,
            request.DueDate);

        await _taskRepository.AddAsync(task, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<TaskItemDto>(task);
        return ApiResponse<TaskItemDto>.Success(dto, "Task created successfully.");
    }
}
