using Workora.Domain.Entities;
using Workora.Domain.Enums;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for performance appraisals and employee goals.
/// </summary>
public interface IPerformanceRepository : IRepository<Appraisal>
{
    /// <summary>
    /// Gets appraisals for an employee or company with filters.
    /// </summary>
    Task<IReadOnlyList<Appraisal>> GetAppraisalsPagedAsync(int pageNumber, int pageSize, int? employeeId = null, int? reviewerId = null, int? year = null, AppraisalStatus? status = null, CancellationToken ct = default);

    /// <summary>
    /// Gets total count of appraisals.
    /// </summary>
    Task<int> GetAppraisalsCountAsync(int? employeeId = null, int? reviewerId = null, int? year = null, AppraisalStatus? status = null, CancellationToken ct = default);

    /// <summary>
    /// Gets an appraisal by ID with employee and reviewer details.
    /// </summary>
    Task<Appraisal?> GetAppraisalWithDetailsAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Adds a goal.
    /// </summary>
    Task AddGoalAsync(Goal goal, CancellationToken ct = default);

    /// <summary>
    /// Gets a goal by ID.
    /// </summary>
    Task<Goal?> GetGoalByIdAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Gets goals for an employee.
    /// </summary>
    Task<IReadOnlyList<Goal>> GetEmployeeGoalsAsync(int employeeId, GoalStatus? status = null, CancellationToken ct = default);

    /// <summary>
    /// Updates a goal.
    /// </summary>
    void UpdateGoal(Goal goal);
}
