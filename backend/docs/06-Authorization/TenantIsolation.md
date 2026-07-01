# Tenant Isolation (Defense-in-Depth)

Workora is a multi-tenant SaaS application operating on a shared-database, shared-schema model. Ensuring that one tenant cannot access another tenant's data is the highest security priority.

We implement **Defense-in-Depth** to guarantee tenant isolation.

## 1. Request Level (JWT)
The `TenantId` is embedded directly into the user's JWT at login. A user cannot switch tenants by simply changing a URL parameter or a request header. 

When a request arrives, the `ITenantContext` (a Scoped dependency injection service) extracts the `TenantId` from the JWT claims.

## 2. Application Level (MediatR Behaviors)
The `TenantAuthorizationBehavior` sits in the MediatR pipeline. If a command (e.g., `UpdateEmployeeCommand`) contains a resource ID, the application layer *could* perform a quick cache lookup to verify the resource actually belongs to `ctx.TenantId`.

## 3. Database Level (Global Query Filters)
This is the ultimate failsafe. In `ApplicationDbContext`, we apply an EF Core Global Query Filter to every entity that implements `IMustHaveTenant`.

```csharp
protected override void OnModelCreating(ModelBuilder builder)
{
    base.OnModelCreating(builder);
    
    // ...
    
    builder.Entity<Employee>().HasQueryFilter(e => e.TenantId == _tenantContext.TenantId);
    builder.Entity<LeaveRequest>().HasQueryFilter(e => e.TenantId == _tenantContext.TenantId);
}
```

**How it works:**
If a developer writes a bug in `GetEmployeeByIdQueryHandler`:
`await _context.Employees.FirstOrDefaultAsync(e => e.Id == request.EmployeeId);`
*(Notice they forgot to check the TenantId)*

The Global Query Filter automatically rewrites the SQL sent to PostgreSQL:
`SELECT * FROM employees WHERE id = @id AND tenant_id = @tenant_id;`

If the Employee ID belongs to Tenant B, but the user is Tenant A, EF Core returns `null`. The handler then returns a `404 Not Found`, ensuring the user doesn't even know the record exists in another tenant.
