using AutoMapper;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Queries.GetEmployeeById;

/// <summary>
/// Handler for <see cref="GetEmployeeByIdQuery"/>.
/// </summary>
public class GetEmployeeByIdQueryHandler : IRequestHandler<GetEmployeeByIdQuery, ApiResponse<EmployeeDetailDto>>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetEmployeeByIdQueryHandler"/> class.
    /// </summary>
    public GetEmployeeByIdQueryHandler(IEmployeeRepository employeeRepository, IMapper mapper)
    {
        _employeeRepository = employeeRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<EmployeeDetailDto>> Handle(GetEmployeeByIdQuery request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetWithFullDetailsAsync(request.Id, ct);
        if (employee == null)
        {
            return ApiResponse<EmployeeDetailDto>.Fail("Employee not found.");
        }

        var dto = _mapper.Map<EmployeeDetailDto>(employee);
        return ApiResponse<EmployeeDetailDto>.Success(dto);
    }
}
