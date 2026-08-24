using AutoMapper;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Queries.GetEmployeeEmploymentHistory;

/// <summary>
/// Query to retrieve an employee's historical transitions and events.
/// </summary>
public record GetEmployeeEmploymentHistoryQuery(int Id) : IRequest<ApiResponse<IReadOnlyList<EmploymentHistoryDto>>>;

/// <summary>
/// Handler for <see cref="GetEmployeeEmploymentHistoryQuery"/>.
/// </summary>
public class GetEmployeeEmploymentHistoryQueryHandler : IRequestHandler<GetEmployeeEmploymentHistoryQuery, ApiResponse<IReadOnlyList<EmploymentHistoryDto>>>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetEmployeeEmploymentHistoryQueryHandler"/> class.
    /// </summary>
    public GetEmployeeEmploymentHistoryQueryHandler(IEmployeeRepository employeeRepository, IMapper mapper)
    {
        _employeeRepository = employeeRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<EmploymentHistoryDto>>> Handle(GetEmployeeEmploymentHistoryQuery request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetWithFullDetailsAsync(request.Id, ct);
        if (employee == null)
        {
            return ApiResponse<IReadOnlyList<EmploymentHistoryDto>>.Fail("Employee not found.");
        }

        var dtos = _mapper.Map<IReadOnlyList<EmploymentHistoryDto>>(employee.EmploymentHistory);
        return ApiResponse<IReadOnlyList<EmploymentHistoryDto>>.Success(dtos);
    }
}
