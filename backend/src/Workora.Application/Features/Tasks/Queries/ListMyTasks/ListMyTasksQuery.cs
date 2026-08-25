using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Tasks.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Tasks.Queries.ListMyTasks;

/// <summary>
/// Query to list tasks assigned to the currently authenticated employee.
/// </summary>
public record ListMyTasksQuery(TaskItemStatus? Status) : IRequest<ApiResponse<List<TaskItemDto>>>;

/// <summary>
/// Handler for <see cref="ListMyTasksQuery"/>.
/// </summary>
public class ListMyTasksQueryHandler : IRequestHandler<ListMyTasksQuery, ApiResponse<List<TaskItemDto>>>
{
    private readonly ITaskItemRepository _taskRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public ListMyTasksQueryHandler(
        ITaskItemRepository taskRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IEmployeeRepository employeeRepository,
        IMapper mapper)
    {
        _taskRepository = taskRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _employeeRepository = employeeRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<List<TaskItemDto>>> Handle(ListMyTasksQuery request, CancellationToken ct)
    {
        if (_currentUserService.UserId == null)
        {
            return ApiResponse<List<TaskItemDto>>.Fail("User context not found.");
        }

        var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
        if (user == null)
        {
            return ApiResponse<List<TaskItemDto>>.Fail("User account not found.");
        }

        var employee = await _employeeRepository.GetByUserIdAsync(user.Id, ct);
        if (employee == null)
        {
            return ApiResponse<List<TaskItemDto>>.Fail("Authenticated user is not linked to an employee record.");
        }

        var tasks = await _taskRepository.GetTasksByAssigneeAsync(employee.Id, request.Status, ct);
        var dtos = _mapper.Map<List<TaskItemDto>>(tasks);
        return ApiResponse<List<TaskItemDto>>.Success(dtos);
    }
}
