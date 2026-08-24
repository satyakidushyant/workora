using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetMyPayslips;

/// <summary>
/// Query for an employee to retrieve all their issued payslips.
/// </summary>
public record GetMyPayslipsQuery(int? Year = null) : IRequest<ApiResponse<IReadOnlyList<PayslipDto>>>;

/// <summary>
/// Handler for <see cref="GetMyPayslipsQuery"/>.
/// </summary>
public class GetMyPayslipsQueryHandler : IRequestHandler<GetMyPayslipsQuery, ApiResponse<IReadOnlyList<PayslipDto>>>
{
    private readonly IPayrollRepository _payrollRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetMyPayslipsQueryHandler"/> class.
    /// </summary>
    public GetMyPayslipsQueryHandler(
        IPayrollRepository payrollRepository,
        IEmployeeRepository employeeRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IMapper mapper)
    {
        _payrollRepository = payrollRepository;
        _employeeRepository = employeeRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<PayslipDto>>> Handle(GetMyPayslipsQuery request, CancellationToken ct)
    {
        if (_currentUserService.UserId == null)
        {
            return ApiResponse<IReadOnlyList<PayslipDto>>.Fail("User context not found.");
        }

        var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
        if (user == null)
        {
            return ApiResponse<IReadOnlyList<PayslipDto>>.Fail("User account not found.");
        }

        var employee = await _employeeRepository.GetByUserIdAsync(user.Id, ct);
        if (employee == null)
        {
            return ApiResponse<IReadOnlyList<PayslipDto>>.Fail("No employee linked to this user account.");
        }

        var payslips = await _payrollRepository.GetEmployeePayslipsAsync(employee.Id, request.Year, ct);
        var dtos = _mapper.Map<IReadOnlyList<PayslipDto>>(payslips);
        return ApiResponse<IReadOnlyList<PayslipDto>>.Success(dtos);
    }
}
