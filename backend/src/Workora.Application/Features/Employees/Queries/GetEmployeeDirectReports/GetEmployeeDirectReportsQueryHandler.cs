using AutoMapper;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Queries.GetEmployeeDirectReports;

/// <summary>
/// Handler for <see cref="GetEmployeeDirectReportsQuery"/>.
/// </summary>
public class GetEmployeeDirectReportsQueryHandler : IRequestHandler<GetEmployeeDirectReportsQuery, ApiResponse<IReadOnlyList<EmployeeDto>>>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetEmployeeDirectReportsQueryHandler"/> class.
    /// </summary>
    public GetEmployeeDirectReportsQueryHandler(IEmployeeRepository employeeRepository, IMapper mapper)
    {
        _employeeRepository = employeeRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<EmployeeDto>>> Handle(GetEmployeeDirectReportsQuery request, CancellationToken ct)
    {
        var reports = await _employeeRepository.GetDirectReportsAsync(request.Id, ct);
        var dtos = _mapper.Map<IReadOnlyList<EmployeeDto>>(reports);
        return ApiResponse<IReadOnlyList<EmployeeDto>>.Success(dtos);
    }
}
