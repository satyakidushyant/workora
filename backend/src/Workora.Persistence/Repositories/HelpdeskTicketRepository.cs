using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="HelpdeskTicket"/>.
/// </summary>
public class HelpdeskTicketRepository : GenericRepository<HelpdeskTicket>, IHelpdeskTicketRepository
{
    /// <inheritdoc />
    public HelpdeskTicketRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<HelpdeskTicket?> GetWithCommentsAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Set<HelpdeskTicket>()
            .Include(x => x.RaisedByEmployee)
            .Include(x => x.AssignedToEmployee)
            .Include(x => x.Comments.OrderBy(c => c.CreatedAt))
                .ThenInclude(c => c.User)
            .FirstOrDefaultAsync(x => x.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task<List<HelpdeskTicket>> GetTicketsByEmployeeAsync(int employeeId, CancellationToken ct = default)
    {
        return await _dbContext.Set<HelpdeskTicket>()
            .Include(x => x.AssignedToEmployee)
            .Where(x => x.RaisedByEmployeeId == employeeId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<List<HelpdeskTicket>> GetTicketsByAssigneeAsync(int agentEmployeeId, CancellationToken ct = default)
    {
        return await _dbContext.Set<HelpdeskTicket>()
            .Include(x => x.RaisedByEmployee)
            .Where(x => x.AssignedToEmployeeId == agentEmployeeId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<List<HelpdeskTicket>> GetCompanyTicketsAsync(int? companyId, TicketStatus? status, TicketCategory? category, TicketPriority? priority, CancellationToken ct = default)
    {
        var query = _dbContext.Set<HelpdeskTicket>()
            .Include(x => x.RaisedByEmployee)
            .Include(x => x.AssignedToEmployee)
            .AsQueryable();

        if (companyId.HasValue)
        {
            query = query.Where(x => x.CompanyId == companyId.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(x => x.Status == status.Value);
        }

        if (category.HasValue)
        {
            query = query.Where(x => x.Category == category.Value);
        }

        if (priority.HasValue)
        {
            query = query.Where(x => x.Priority == priority.Value);
        }

        return await query.OrderByDescending(x => x.CreatedAt).ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetCountForYearAsync(int year, CancellationToken ct = default)
    {
        return await _dbContext.Set<HelpdeskTicket>()
            .CountAsync(x => x.CreatedAt.Year == year, ct);
    }

    /// <inheritdoc />
    public async Task AddCommentAsync(HelpdeskTicketComment comment, CancellationToken ct = default)
    {
        await _dbContext.Set<HelpdeskTicketComment>().AddAsync(comment, ct);
    }
}
