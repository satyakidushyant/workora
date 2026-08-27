using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for recruitment operations.
/// </summary>
public class RecruitmentRepository : GenericRepository<JobPosting>, IRecruitmentRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="RecruitmentRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public RecruitmentRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<IReadOnlyList<JobPosting>> GetJobsPagedAsync(int pageNumber, int pageSize, int? companyId = null, int? departmentId = null, JobStatus? status = null, string? searchTerm = null, CancellationToken ct = default)
    {
        var query = BuildJobQuery(companyId, departmentId, status, searchTerm);

        return await query
            .OrderByDescending(j => j.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetJobsCountAsync(int? companyId = null, int? departmentId = null, JobStatus? status = null, string? searchTerm = null, CancellationToken ct = default)
    {
        var query = BuildJobQuery(companyId, departmentId, status, searchTerm);
        return await query.CountAsync(ct);
    }

    /// <inheritdoc />
    public async Task<JobPosting?> GetJobWithDetailsAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Set<JobPosting>()
            .Include(j => j.Department)
            .Include(j => j.Candidates)
            .FirstOrDefaultAsync(j => j.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task<Candidate?> GetCandidateByIdAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Set<Candidate>()
            .Include(c => c.JobPosting)
            .Include(c => c.Interviews)
            .ThenInclude(i => i.Interviewer)
            .Include(c => c.Offers)
            .FirstOrDefaultAsync(c => c.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Candidate>> GetCandidatesPagedAsync(int pageNumber, int pageSize, int? jobPostingId = null, CandidateStage? stage = null, string? searchTerm = null, int? companyId = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<Candidate>()
            .AsNoTracking()
            .Include(c => c.JobPosting)
            .AsQueryable();

        if (companyId.HasValue)
        {
            var cid = companyId.Value;
            query = query.Where(c => c.JobPosting != null && c.JobPosting.CompanyId == cid);
        }

        if (jobPostingId.HasValue)
        {
            query = query.Where(c => c.JobPostingId == jobPostingId.Value);
        }

        if (stage.HasValue)
        {
            query = query.Where(c => c.Stage == stage.Value);
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(c => c.FirstName.ToLower().Contains(term) || c.LastName.ToLower().Contains(term) || EF.Property<string>(c, "Email").ToLower().Contains(term));
        }

        return await query
            .OrderByDescending(c => c.AppliedDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetCandidatesCountAsync(int? jobPostingId = null, CandidateStage? stage = null, string? searchTerm = null, int? companyId = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<Candidate>()
            .AsNoTracking()
            .Include(c => c.JobPosting)
            .AsQueryable();

        if (companyId.HasValue)
        {
            var cid = companyId.Value;
            query = query.Where(c => c.JobPosting != null && c.JobPosting.CompanyId == cid);
        }

        if (jobPostingId.HasValue)
        {
            query = query.Where(c => c.JobPostingId == jobPostingId.Value);
        }

        if (stage.HasValue)
        {
            query = query.Where(c => c.Stage == stage.Value);
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(c => c.FirstName.ToLower().Contains(term) || c.LastName.ToLower().Contains(term) || EF.Property<string>(c, "Email").ToLower().Contains(term));
        }

        return await query.CountAsync(ct);
    }

    /// <inheritdoc />
    public async Task AddCandidateAsync(Candidate candidate, CancellationToken ct = default)
    {
        await _dbContext.Set<Candidate>().AddAsync(candidate, ct);
    }

    /// <inheritdoc />
    public void UpdateCandidate(Candidate candidate)
    {
        _dbContext.Set<Candidate>().Update(candidate);
    }

    /// <inheritdoc />
    public async Task AddInterviewAsync(Interview interview, CancellationToken ct = default)
    {
        await _dbContext.Set<Interview>().AddAsync(interview, ct);
    }

    /// <inheritdoc />
    public async Task<Interview?> GetInterviewByIdAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Set<Interview>()
            .Include(i => i.Candidate)
            .Include(i => i.Interviewer)
            .FirstOrDefaultAsync(i => i.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Interview>> GetInterviewsListAsync(int? interviewerId = null, int? candidateId = null, InterviewStatus? status = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<Interview>()
            .AsNoTracking()
            .Include(i => i.Candidate)
            .Include(i => i.Interviewer)
            .AsQueryable();

        if (interviewerId.HasValue)
        {
            query = query.Where(i => i.InterviewerEmployeeId == interviewerId.Value);
        }

        if (candidateId.HasValue)
        {
            query = query.Where(i => i.CandidateId == candidateId.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(i => i.Status == status.Value);
        }

        return await query.OrderBy(i => i.ScheduledAt).ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task AddOfferAsync(JobOffer offer, CancellationToken ct = default)
    {
        await _dbContext.Set<JobOffer>().AddAsync(offer, ct);
    }

    /// <inheritdoc />
    public async Task<JobOffer?> GetOfferByIdAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Set<JobOffer>()
            .Include(o => o.Candidate)
            .FirstOrDefaultAsync(o => o.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyDictionary<CandidateStage, int>> GetPipelineStageMetricsAsync(int? jobPostingId = null, int? companyId = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<Candidate>().AsNoTracking().Include(c => c.JobPosting).AsQueryable();

        if (jobPostingId.HasValue)
        {
            query = query.Where(c => c.JobPostingId == jobPostingId.Value);
        }

        if (companyId.HasValue)
        {
            query = query.Where(c => c.JobPosting.CompanyId == companyId.Value);
        }

        var counts = await query
            .GroupBy(c => c.Stage)
            .Select(g => new { Stage = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        var result = Enum.GetValues<CandidateStage>()
            .ToDictionary(s => s, s => counts.FirstOrDefault(c => c.Stage == s)?.Count ?? 0);

        return result;
    }

    private IQueryable<JobPosting> BuildJobQuery(int? companyId, int? departmentId, JobStatus? status, string? searchTerm)
    {
        var query = _dbContext.Set<JobPosting>()
            .AsNoTracking()
            .Include(j => j.Department)
            .AsQueryable();

        if (companyId.HasValue)
        {
            query = query.Where(j => j.CompanyId == companyId.Value);
        }

        if (departmentId.HasValue)
        {
            query = query.Where(j => j.DepartmentId == departmentId.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(j => j.Status == status.Value);
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(j => j.Title.ToLower().Contains(term) || j.Location.ToLower().Contains(term));
        }

        return query;
    }
}
