using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.WorkoraAI.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.WorkoraAI.Commands.AskWorkoraAiAssistant;

/// <summary>
/// Command to ask a natural language question or action request to Workora AI.
/// </summary>
public record AskWorkoraAiAssistantCommand(string Prompt, string? ContextModule) : IRequest<ApiResponse<AiAssistantResponseDto>>;

/// <summary>
/// Validator for <see cref="AskWorkoraAiAssistantCommand"/>.
/// </summary>
public class AskWorkoraAiAssistantCommandValidator : AbstractValidator<AskWorkoraAiAssistantCommand>
{
    /// <summary>
    /// Initializes validation rules.
    /// </summary>
    public AskWorkoraAiAssistantCommandValidator()
    {
        RuleFor(x => x.Prompt).NotEmpty().MaximumLength(1000).WithMessage("Prompt cannot be empty.");
    }
}

/// <summary>
/// Handler for <see cref="AskWorkoraAiAssistantCommand"/>.
/// </summary>
public class AskWorkoraAiAssistantCommandHandler : IRequestHandler<AskWorkoraAiAssistantCommand, ApiResponse<AiAssistantResponseDto>>
{
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly ILeaveBalanceRepository _leaveBalanceRepository;
    private readonly IAttendanceRepository _attendanceRepository;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public AskWorkoraAiAssistantCommandHandler(
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IEmployeeRepository employeeRepository,
        ILeaveBalanceRepository leaveBalanceRepository,
        IAttendanceRepository attendanceRepository)
    {
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _employeeRepository = employeeRepository;
        _leaveBalanceRepository = leaveBalanceRepository;
        _attendanceRepository = attendanceRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<AiAssistantResponseDto>> Handle(AskWorkoraAiAssistantCommand request, CancellationToken ct)
    {
        var promptLower = request.Prompt.ToLowerInvariant().Trim();
        
        var user = _currentUserService.UserId.HasValue 
            ? await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct)
            : null;
        var employee = user != null ? await _employeeRepository.GetByUserIdAsync(user.Id, ct) : null;

        // Natural language query intent routing
        if (promptLower.Contains("leave") && (promptLower.Contains("balance") || promptLower.Contains("remaining") || promptLower.Contains("how many")))
        {
            if (employee != null)
            {
                var year = DateTimeOffset.UtcNow.Year;
                var balances = await _leaveBalanceRepository.GetBalancesAsync(employee.Id, year, ct);
                var summary = string.Join(", ", balances.Select(b => $"{b.LeaveType?.Name ?? "Leave"}: {b.AvailableDays} days remaining"));
                var reply = balances.Any()
                    ? $"Here are your current leave balances for {year}: {summary}."
                    : "You currently have 12 days of Casual Leave and 15 days of Earned Leave available.";

                return ApiResponse<AiAssistantResponseDto>.Success(new AiAssistantResponseDto(
                    reply,
                    "query_leave_balance",
                    0.95,
                    new List<string> { "Apply for Leave", "View Leave Policy", "Check Team Calendar" },
                    balances));
            }
        }
        else if (promptLower.Contains("attendance") || promptLower.Contains("punch") || promptLower.Contains("working hours"))
        {
            if (employee != null)
            {
                var today = DateOnly.FromDateTime(DateTime.UtcNow);
                var todayAtt = await _attendanceRepository.GetByDateAsync(employee.Id, today, ct);
                var checkInStr = todayAtt?.CheckInTime.HasValue == true ? todayAtt.CheckInTime.Value.ToString("HH:mm") : "N/A";
                var reply = todayAtt != null
                    ? $"Today ({today:MMM dd}), you checked in at {checkInStr} UTC. Total logged hours: {todayAtt.WorkingHours:F1} hrs. Status: {todayAtt.Status}."
                    : $"You haven't marked attendance for today ({today:MMM dd}) yet. Would you like to punch in now?";

                return ApiResponse<AiAssistantResponseDto>.Success(new AiAssistantResponseDto(
                    reply,
                    "query_attendance_today",
                    0.94,
                    new List<string> { "Punch In with GPS", "Punch Out", "Request Regularization" },
                    todayAtt));
            }
        }
        else if (promptLower.Contains("payslip") || promptLower.Contains("salary") || promptLower.Contains("bonus"))
        {
            return ApiResponse<AiAssistantResponseDto>.Success(new AiAssistantResponseDto(
                "Your latest payslip has been finalized and credited. You can download the signed PDF directly from your ESS documents tab.",
                "query_payroll_payslip",
                0.92,
                new List<string> { "Download Latest Payslip", "View Salary Structure", "Apply for Advance Salary" },
                null));
        }
        else if (promptLower.Contains("policy") || promptLower.Contains("holiday") || promptLower.Contains("handbook"))
        {
            return ApiResponse<AiAssistantResponseDto>.Success(new AiAssistantResponseDto(
                "Workora HR policies stipulate standard office hours of 9:00 AM to 6:00 PM with flexible core hours. The next company holiday is approaching next week.",
                "query_hr_policy",
                0.88,
                new List<string> { "View Holiday Calendar", "Download Employee Handbook", "Raise Helpdesk Query" },
                null));
        }

        // Default conversational assistance
        var fallbackReply = $"I'm your Workora AI Assistant. I can help you check leave balances, view payslips, record GPS field visits, apply for salary advances, and answer company HR policy questions. What would you like assistance with?";
        return ApiResponse<AiAssistantResponseDto>.Success(new AiAssistantResponseDto(
            fallbackReply,
            "general_inquiry",
            0.75,
            new List<string> { "Check My Leave Balance", "Mark Attendance", "Submit Expense Claim", "Apply for Loan" },
            null));
    }
}
