using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

public class LoginAuditLogRepository : GenericRepository<LoginAuditLog>, ILoginAuditLogRepository
{
    public LoginAuditLogRepository(AppDbContext dbContext) : base(dbContext) { }
}
