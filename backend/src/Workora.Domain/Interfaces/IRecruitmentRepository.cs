using Workora.Domain.Entities;
using Workora.Domain.Enums;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for job vacancies, candidates, interviews, and offers.
/// </summary>
public interface IRecruitmentRepository : IRepository<JobPosting>
{
    /// <summary>
    /// Gets a paginated list of job postings with optional company/status filters.
    /// </summary>
    Task<IReadOnlyList<JobPosting>> GetJobsPagedAsync(int pageNumber, int pageSize, int? companyId = null, int? departmentId = null, JobStatus? status = null, string? searchTerm = null, CancellationToken ct = default);

    /// <summary>
    /// Gets total count of job postings matching criteria.
    /// </summary>
    Task<int> GetJobsCountAsync(int? companyId = null, int? departmentId = null, JobStatus? status = null, string? searchTerm = null, CancellationToken ct = default);

    /// <summary>
    /// Gets a job posting by ID with candidates.
    /// </summary>
    Task<JobPosting?> GetJobWithDetailsAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Gets a candidate by ID with interview rounds and offers.
    /// </summary>
    Task<Candidate?> GetCandidateByIdAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Gets a paginated list of candidates with filtering.
    /// </summary>
    Task<IReadOnlyList<Candidate>> GetCandidatesPagedAsync(int pageNumber, int pageSize, int? jobPostingId = null, CandidateStage? stage = null, string? searchTerm = null, CancellationToken ct = default);

    /// <summary>
    /// Gets total count of candidates matching criteria.
    /// </summary>
    Task<int> GetCandidatesCountAsync(int? jobPostingId = null, CandidateStage? stage = null, string? searchTerm = null, CancellationToken ct = default);

    /// <summary>
    /// Adds a new candidate application.
    /// </summary>
    Task AddCandidateAsync(Candidate candidate, CancellationToken ct = default);

    /// <summary>
    /// Updates a candidate record.
    /// </summary>
    void UpdateCandidate(Candidate candidate);

    /// <summary>
    /// Schedules an interview.
    /// </summary>
    Task AddInterviewAsync(Interview interview, CancellationToken ct = default);

    /// <summary>
    /// Gets an interview by ID.
    /// </summary>
    Task<Interview?> GetInterviewByIdAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Gets scheduled interviews for an interviewer or candidate.
    /// </summary>
    Task<IReadOnlyList<Interview>> GetInterviewsListAsync(int? interviewerId = null, int? candidateId = null, InterviewStatus? status = null, CancellationToken ct = default);

    /// <summary>
    /// Adds a job offer.
    /// </summary>
    Task AddOfferAsync(JobOffer offer, CancellationToken ct = default);

    /// <summary>
    /// Gets a job offer by ID.
    /// </summary>
    Task<JobOffer?> GetOfferByIdAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Gets recruitment pipeline metrics per stage for a company or job.
    /// </summary>
    Task<IReadOnlyDictionary<CandidateStage, int>> GetPipelineStageMetricsAsync(int? jobPostingId = null, int? companyId = null, CancellationToken ct = default);
}
