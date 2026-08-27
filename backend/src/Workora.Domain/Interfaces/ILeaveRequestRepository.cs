using Workora.Domain.Entities;
using Workora.Domain.Enums;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for <see cref="LeaveRequest"/> and <see cref="LeaveType"/> entities.
/// </summary>
public interface ILeaveRequestRepository : IRepository<LeaveRequest>
{
    /// <summary>
    /// Gets a leave request with its type, employee, and approval details.
    /// </summary>
    Task<LeaveRequest?> GetWithDetailsAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Checks for overlapping approved leave requests for an employee.
    /// </summary>
    Task<bool> HasOverlappingApprovedLeaveAsync(int employeeId, DateOnly startDate, DateOnly endDate, int? excludeId = null, CancellationToken ct = default);

    /// <summary>
    /// Gets a paginated list of leave requests with filters.
    /// </summary>
    Task<IReadOnlyList<LeaveRequest>> GetPagedListAsync(
        int pageNumber,
        int pageSize,
        int? employeeId = null,
        int? departmentId = null,
        LeaveRequestStatus? status = null,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        int? companyId = null,
        CancellationToken ct = default);

    /// <summary>
    /// Gets total count of leave requests matching filters.
    /// </summary>
    Task<int> GetCountAsync(
        int? employeeId = null,
        int? departmentId = null,
        LeaveRequestStatus? status = null,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        int? companyId = null,
        CancellationToken ct = default);

    /// <summary>
    /// Gets all leave requests for a calendar view within a date range.
    /// </summary>
    Task<IReadOnlyList<LeaveRequest>> GetCalendarListAsync(DateOnly startDate, DateOnly endDate, int? departmentId = null, CancellationToken ct = default);

    /// <summary>
    /// Gets all configured leave types for a company.
    /// </summary>
    Task<IReadOnlyList<LeaveType>> GetLeaveTypesAsync(int? companyId = null, CancellationToken ct = default);

    /// <summary>
    /// Gets a specific leave type by ID.
    /// </summary>
    Task<LeaveType?> GetLeaveTypeByIdAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Adds a new leave type definition.
    /// </summary>
    Task AddLeaveTypeAsync(LeaveType leaveType, CancellationToken ct = default);

    /// <summary>
    /// Updates a leave type definition.
    /// </summary>
    void UpdateLeaveType(LeaveType leaveType);
}
