# Project Flow (CQRS & MediatR)

Workora utilizes **CQRS (Command Query Responsibility Segregation)** pattern orchestrated by **MediatR**. This separates read operations (Queries) from write/mutation operations (Commands).

## The Request Lifecycle

When a client makes an HTTP request to the API, it follows a strict pipeline to ensure security, tenant isolation, validation, and execution.

### 1. API Layer (Controller)
- Receives the incoming HTTP request.
- Handles routing and basic model binding.
- Delegates the request payload to MediatR via `await _mediator.Send(command)`.
- **Rule:** Controllers must be thin; they contain zero business logic.

### 2. MediatR Pipeline Behaviors (Application Layer)
Before reaching the actual handler, the request passes through a series of behaviors (middlewares for MediatR):
1. **LoggingBehavior**: Logs the incoming request details, user, and tenant.
2. **ValidationBehavior**: Uses FluentValidation to validate the DTO/Command. If validation fails, it throws a `ValidationException` which the Global Exception Middleware catches and converts to a `400 Bad Request`.
3. **TenantAuthorizationBehavior**: Resolves the `TenantId` from the current context and ensures the user has access.
4. **TransactionBehavior**: For Commands only, wraps the execution in a database transaction (`IUnitOfWork.BeginTransactionAsync`).

### 3. Command/Query Handler (Application Layer)
- **Commands**: 
  - Fetch aggregates using a repository.
  - Execute business logic methods on the Domain Aggregate Root.
  - Call `IUnitOfWork.SaveChangesAsync()`.
  - Raise any Domain Events.
- **Queries**: 
  - Fetch data directly via Repositories or Dapper.
  - Map entities to DTOs using AutoMapper.
  - Return the payload.

### 4. Persistence Layer (EF Core)
- The `DbContext` intercepts `SaveChanges`.
- Automatically populates `AuditableEntity` fields (`CreatedBy`, `UpdatedDate`).
- **Global Query Filter** automatically appends `WHERE TenantId = @tenantId` to ensure cross-tenant data leaks are impossible at the database query level.

## Example Flow: Update Employee

```mermaid
flowchart TD
    Client["Client (Angular/Mobile)"] -->|PUT /api/v1/employees/123| API["EmployeesController"]
    API -->|Send(UpdateEmployeeCommand)| Pipeline["MediatR Pipeline"]
    Pipeline -->|Validation| Val["ValidationBehavior"]
    Pipeline -->|Transaction| Tx["TransactionBehavior"]
    Tx --> Handler["UpdateEmployeeCommandHandler"]
    Handler -->|GetByIdAsync(123)| Repo["EmployeeRepository"]
    Handler -->|UpdateDetails(...)| Domain["Employee (Aggregate Root)"]
    Handler -->|SaveChangesAsync| UoW["IUnitOfWork / DbContext"]
    UoW -->|Commit| DB[(PostgreSQL)]
    DB --> UoW
    UoW --> Handler
    Handler --> Tx
    Tx --> API
    API -->|200 OK| Client
```
