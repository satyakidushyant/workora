using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for organizational documents.
/// </summary>
public class DocumentRepository : GenericRepository<Document>, IDocumentRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DocumentRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public DocumentRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Document>> GetDocumentsPagedAsync(int pageNumber, int pageSize, int? companyId = null, int? employeeId = null, DocumentCategory? category = null, string? searchTerm = null, CancellationToken ct = default)
    {
        var query = BuildDocumentQuery(companyId, employeeId, category, searchTerm);

        return await query
            .OrderByDescending(d => d.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetDocumentsCountAsync(int? companyId = null, int? employeeId = null, DocumentCategory? category = null, string? searchTerm = null, CancellationToken ct = default)
    {
        var query = BuildDocumentQuery(companyId, employeeId, category, searchTerm);
        return await query.CountAsync(ct);
    }

    private IQueryable<Document> BuildDocumentQuery(int? companyId, int? employeeId, DocumentCategory? category, string? searchTerm)
    {
        var query = _dbContext.Set<Document>()
            .AsNoTracking()
            .Include(d => d.Employee)
            .AsQueryable();

        if (companyId.HasValue)
        {
            query = query.Where(d => d.CompanyId == companyId.Value);
        }

        if (employeeId.HasValue)
        {
            query = query.Where(d => d.EmployeeId == employeeId.Value);
        }

        if (category.HasValue)
        {
            query = query.Where(d => d.Category == category.Value);
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(d => d.Title.ToLower().Contains(term) || d.FileName.ToLower().Contains(term));
        }

        return query;
    }
}
