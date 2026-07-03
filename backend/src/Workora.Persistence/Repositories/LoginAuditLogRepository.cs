using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="LoginAuditLog"/> entities.
/// </summary>
public class LoginAuditLogRepository : GenericRepository<LoginAuditLog>, ILoginAuditLogRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="LoginAuditLogRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public LoginAuditLogRepository(AppDbContext dbContext) : base(dbContext) { }
}
