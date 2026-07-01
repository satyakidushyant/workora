# Naming Conventions

Consistent naming is critical for maintainability across the C# codebase and the PostgreSQL database.

## C# Code Conventions

1. **Interfaces**: Prefix with `I` (e.g., `IEmployeeRepository`).
2. **Classes / Structs / Records**: PascalCase (e.g., `LeaveRequest`, `CreateEmployeeCommand`).
3. **Properties**: PascalCase (e.g., `FirstName`, `TenantId`).
4. **Private Fields**: camelCase prefixed with an underscore (e.g., `_employeeRepository`, `_tenantId`).
5. **Method Parameters & Local Variables**: camelCase (e.g., `employeeId`, `startDate`).
6. **Constants**: PascalCase (e.g., `DefaultPageSize`). *Note: Do not use ALL_CAPS in C#.*
7. **Asynchronous Methods**: Suffix with `Async` (e.g., `GetEmployeeByIdAsync`).

## Database Conventions (PostgreSQL)

Entity Framework Core should be configured (via conventions or interceptors like EFCore.NamingConventions) to map C# PascalCase objects to PostgreSQL standard `snake_case`.

1. **Tables**: plural, `snake_case` (e.g., `employees`, `leave_requests`, `payroll_runs`).
2. **Columns**: singular, `snake_case` (e.g., `first_name`, `tenant_id`, `created_date`).
3. **Primary Keys**: Always named `id` (maps from C# `Id`).
4. **Foreign Keys**: Suffixed with `_id` (e.g., `department_id`).
5. **Indexes**: Prefix with `ix_`, followed by table name, followed by column name(s) (e.g., `ix_employees_tenant_id`).
6. **Foreign Key Constraints**: Prefix with `fk_` (e.g., `fk_employees_departments_department_id`).

## Architecture Specifics

- **Commands**: Suffix with `Command` (e.g., `ApproveLeaveCommand`).
- **Command Handlers**: Suffix with `CommandHandler` (e.g., `ApproveLeaveCommandHandler`).
- **Queries**: Suffix with `Query` (e.g., `GetEmployeeDetailsQuery`).
- **Query Handlers**: Suffix with `QueryHandler` (e.g., `GetEmployeeDetailsQueryHandler`).
- **DTOs**: No suffix is strictly required, but `Dto` can be used for clarity (e.g., `EmployeeDetailsDto`). Alternatively, use `Response` (e.g., `EmployeeResponse`).
