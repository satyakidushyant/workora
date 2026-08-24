using Workora.Domain.Entities;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for training programs and employee course enrollments.
/// </summary>
public interface ITrainingRepository : IRepository<TrainingProgram>
{
    /// <summary>
    /// Gets training programs for a company.
    /// </summary>
    Task<IReadOnlyList<TrainingProgram>> GetProgramsPagedAsync(int pageNumber, int pageSize, int? companyId = null, CancellationToken ct = default);

    /// <summary>
    /// Gets total count of training programs.
    /// </summary>
    Task<int> GetProgramsCountAsync(int? companyId = null, CancellationToken ct = default);

    /// <summary>
    /// Gets a training program with its enrollments.
    /// </summary>
    Task<TrainingProgram?> GetWithEnrollmentsAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Enrolls an employee in a training program.
    /// </summary>
    Task AddEnrollmentAsync(TrainingEnrollment enrollment, CancellationToken ct = default);

    /// <summary>
    /// Gets an enrollment by ID.
    /// </summary>
    Task<TrainingEnrollment?> GetEnrollmentByIdAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Updates an enrollment.
    /// </summary>
    void UpdateEnrollment(TrainingEnrollment enrollment);
}
