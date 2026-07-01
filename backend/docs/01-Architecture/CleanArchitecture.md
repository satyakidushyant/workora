# Clean Architecture

Workora follows Clean Architecture (Onion/Hexagonal) principles combined with Domain-Driven Design (DDD) and Command Query Responsibility Segregation (CQRS) via MediatR. 

The primary rule of Clean Architecture is that dependencies point inward. The inner layers contain the business rules, while the outer layers contain the implementation details (UI, database, external services).

## Layers Overview

### 1. Domain Layer (`Workora.Domain`)
This is the core of the system. It has **zero external dependencies** (no references to EF Core, ASP.NET, or any infrastructure packages).
- **Entities & Aggregates:** `Employee`, `Department`, `LeaveRequest`, `PayrollRun`, `User`, `Role`.
- **Value Objects:** `Money`, `DateRange`, `EmployeeCode`.
- **Domain Events:** Raised by aggregates and dispatched post-commit (e.g., `LeaveApprovedEvent`).
- **Base Types:** `AuditableEntity` (tracking CreatedBy, UpdatedBy, etc.).

### 2. Application Layer (`Workora.Application`)
Contains the application's use cases and business logic execution. Depends only on the Domain layer.
- **CQRS:** Commands (mutations) and Queries (reads).
- **MediatR:** Used for decoupling request routing. `IRequestHandler` implements the business logic.
- **Pipeline Behaviors:** Global cross-cutting concerns like `LoggingBehavior`, `ValidationBehavior` (FluentValidation), `TenantAuthorizationBehavior`, and `TransactionBehavior`.
- **Abstractions:** Defines interfaces implemented by Infrastructure (`IMediaService`, `IEmailService`, `ITenantContext`).

### 3. Infrastructure Layer (`Workora.Infrastructure`)
Contains concrete implementations for the interfaces defined in the Application layer.
- **Identity:** JWT issuance, ASP.NET Identity integration (`IIdentityService`).
- **External Services:** `IEmailService`, `ISmsService`, `IMediaService` (Cloudinary).
- **Caching:** Redis (`ICacheService`).
- **Statutory Rules:** `IPayrollStatutoryRuleProvider` (PF, ESI, PT, TDS).

### 4. Persistence Layer (`Workora.Persistence`)
Responsible for database interactions using Entity Framework Core.
- **DbContext:** `ApplicationDbContext` with a **Global Query Filter on `TenantId`**.
- **Configurations:** EF Core Fluent API configurations (no data annotations).
- **Repositories:** `IGenericRepository<T>` and specific repositories implementing Domain interfaces.
- **Unit of Work:** `IUnitOfWork` for transactional integrity (`BeginTransactionAsync`, `CommitAsync`).

### 5. API Layer (`Workora.API`)
The entry point of the application. It acts as the Presentation layer.
- **Controllers:** Thin controllers that delegate requests directly to `IMediator.Send`.
- **Middleware:** Global Exception Middleware, Rate Limiting, Correlation ID.
- **Authorization:** Policy-based RBAC (`PermissionAuthorizationHandler`).
- **Documentation:** Swagger/OpenAPI.
