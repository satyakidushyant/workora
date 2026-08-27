using AutoMapper;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetSalaryStructureHistory;

/// <summary>
/// Handler for <see cref="GetSalaryStructureHistoryQuery"/>.
/// </summary>
public class GetSalaryStructureHistoryQueryHandler : IRequestHandler<GetSalaryStructureHistoryQuery, ApiResponse<IReadOnlyList<EmployeeSalaryAssignmentDto>>>
{
    private readonly IGenericRepository<EmployeeSalaryAssignment> _assignmentRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetSalaryStructureHistoryQueryHandler"/> class.
    /// </summary>
    public GetSalaryStructureHistoryQueryHandler(
        IGenericRepository<EmployeeSalaryAssignment> assignmentRepository,
        IMapper mapper)
    {
        _assignmentRepository = assignmentRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Handles retrieval of employee salary structure history.
    /// </summary>
    public Task<ApiResponse<IReadOnlyList<EmployeeSalaryAssignmentDto>>> Handle(GetSalaryStructureHistoryQuery request, CancellationToken cancellationToken)
    {
        var assignments = _assignmentRepository.GetQueryable()
            .Where(a => a.EmployeeId == request.EmployeeId)
            .OrderByDescending(a => a.EffectiveFrom)
            .ToList();

        var dtos = _mapper.Map<List<EmployeeSalaryAssignmentDto>>(assignments);

        return Task.FromResult(ApiResponse<IReadOnlyList<EmployeeSalaryAssignmentDto>>.Success(
            dtos, "Employee salary structure revision history retrieved successfully."));
    }
}
