using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="Company"/> entities.
/// </summary>
public class CompanyRepository : GenericRepository<Company>, ICompanyRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="CompanyRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public CompanyRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<Company?> GetDefaultCompanyAsync(CancellationToken ct = default)
    {
        return await _dbContext.Companies
            .Include(c => c.Branches)
            .Include(c => c.Departments)
            .OrderBy(c => c.Id)
            .FirstOrDefaultAsync(ct);
    }

    /// <inheritdoc />
    public async Task<bool> IsCodeUniqueAsync(string code, int? excludeId = null, CancellationToken ct = default)
    {
        var normalizedCode = code.Trim().ToUpperInvariant();
        return !await _dbContext.Companies
            .AnyAsync(c => c.Code == normalizedCode && (!excludeId.HasValue || c.Id != excludeId.Value), ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Company>> GetAllCompaniesAsync(CancellationToken ct = default)
    {
        return await _dbContext.Companies
            .AsNoTracking()
            .OrderBy(c => c.Name)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<Company?> GetByEmailOrDomainAsync(string email, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(email)) return null;
        var normEmail = email.Trim().ToLowerInvariant();

        var company = await _dbContext.Companies
            .Include(c => c.Branches)
            .Include(c => c.Departments)
            .FirstOrDefaultAsync(c => c.Email != null && c.Email.ToLower() == normEmail, ct);

        if (company != null) return company;

        if (normEmail.Contains('@'))
        {
            var domain = normEmail.Split('@')[1];
            var ignoredDomains = new[] { "workora.com", "gmail.com", "outlook.com", "yahoo.com", "hotmail.com" };
            if (!ignoredDomains.Contains(domain))
            {
                company = await _dbContext.Companies
                    .Include(c => c.Branches)
                    .Include(c => c.Departments)
                    .FirstOrDefaultAsync(c => 
                        (c.Email != null && c.Email.ToLower().EndsWith("@" + domain)) ||
                        (c.Website != null && c.Website.ToLower().Contains(domain)), ct);
            }
        }

        return company;
    }
}
