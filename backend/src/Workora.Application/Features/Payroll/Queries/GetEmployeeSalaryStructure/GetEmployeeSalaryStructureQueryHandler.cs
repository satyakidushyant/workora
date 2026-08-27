using AutoMapper;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetEmployeeSalaryStructure;

/// <summary>
/// Handler for <see cref="GetEmployeeSalaryStructureQuery"/>.
/// </summary>
public class GetEmployeeSalaryStructureQueryHandler : IRequestHandler<GetEmployeeSalaryStructureQuery, ApiResponse<EmployeeSalaryAssignmentDto>>
{
    private readonly ISalaryStructureRepository _salaryStructureRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetEmployeeSalaryStructureQueryHandler"/> class.
    /// </summary>
    public GetEmployeeSalaryStructureQueryHandler(ISalaryStructureRepository salaryStructureRepository, IMapper mapper)
    {
        _salaryStructureRepository = salaryStructureRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<EmployeeSalaryAssignmentDto>> Handle(GetEmployeeSalaryStructureQuery request, CancellationToken ct)
    {
        var assignment = await _salaryStructureRepository.GetActiveEmployeeAssignmentAsync(request.EmployeeId, null, ct);
        if (assignment == null)
        {
            return ApiResponse<EmployeeSalaryAssignmentDto>.Fail("No active salary structure assigned to this employee.");
        }

        var dto = _mapper.Map<EmployeeSalaryAssignmentDto>(assignment);
        return ApiResponse<EmployeeSalaryAssignmentDto>.Success(dto);
    }
}
