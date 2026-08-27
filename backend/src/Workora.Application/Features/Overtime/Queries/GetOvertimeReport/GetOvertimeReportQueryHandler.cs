using AutoMapper;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Features.Overtime.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Overtime.Queries.GetOvertimeReport;

/// <summary>
/// Handler for <see cref="GetOvertimeReportQuery"/>.
/// </summary>
public class GetOvertimeReportQueryHandler : IRequestHandler<GetOvertimeReportQuery, ApiResponse<OvertimeReportDto>>
{
    private readonly IOvertimeRequestRepository _overtimeRequestRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetOvertimeReportQueryHandler"/> class.
    /// </summary>
    public GetOvertimeReportQueryHandler(
        IOvertimeRequestRepository overtimeRequestRepository,
        IEmployeeRepository employeeRepository,
        IMapper mapper)
    {
        _overtimeRequestRepository = overtimeRequestRepository;
        _employeeRepository = employeeRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<OvertimeReportDto>> Handle(GetOvertimeReportQuery request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetByIdAsync(request.EmployeeId, ct);
        if (employee == null)
        {
            return ApiResponse<OvertimeReportDto>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        var overtimeRequests = await _overtimeRequestRepository.GetEmployeeOvertimeReportAsync(
            request.EmployeeId,
            request.FromDate,
            request.ToDate,
            ct);

        var dtos = _mapper.Map<List<OvertimeRequestDto>>(overtimeRequests);

        var report = new OvertimeReportDto
        {
            EmployeeId = employee.Id,
            EmployeeName = $"{employee.FirstName} {employee.LastName}",
            EmployeeCode = employee.EmployeeCode,
            Department = employee.Department?.Name ?? string.Empty,
            TotalOvertimeHours = dtos.Sum(d => d.HoursRequested),
            TotalOvertimeDays = dtos.Count,
            OvertimeRequests = dtos
        };

        return ApiResponse<OvertimeReportDto>.Success(report);
    }
}
