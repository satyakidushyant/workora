# Workora Backend - AI Coding Guidelines

> **AI INSTRUCTION:** You MUST strictly follow these guidelines when analyzing, modifying, or generating code for the Workora backend. Workora uses a strict **Clean Architecture (Onion/Hexagonal)** with **CQRS (MediatR)**, **Domain-Driven Design (DDD)**, and **Multi-Tenancy** enforced at the database level.

---

## 1. Architecture & Dependency Rules
- **Domain Layer (`Workora.Domain`)**: ZERO external dependencies. No references to EF Core, ASP.NET Core, or any infrastructure Nuget packages.
- **Application Layer (`Workora.Application`)**: Depends ONLY on Domain. Contains MediatR Commands/Queries, Handlers, FluentValidation rules, and DTOs. Global pipeline behaviors (Logging, Validation, TenantAuth, Transaction) must be utilized.
- **Infrastructure Layer (`Workora.Infrastructure`)**: Depends on Application. Contains concrete implementations of abstractions (e.g., JWT issuance, Cloudinary integration, Email, Cache).
- **Persistence Layer (`Workora.Persistence`)**: Depends on Application and Domain. Contains `ApplicationDbContext`, EF Core configurations, and Repositories.
- **API Layer (`Workora.API`)**: Thin controllers that delegate strictly to `IMediator.Send`. NO business logic here. Implement Global Middlewares (Exception Middleware, Rate Limiting, Correlation ID).

## 2. Multi-Tenancy (CRITICAL)
- The application uses a **Shared-Database, Shared-Schema** multi-tenancy model.
- Every tenant-scoped entity MUST inherit from `IMustHaveTenant` and have a `TenantId` (UUID).
- **Global Query Filter**: Do NOT manually add `.Where(x => x.TenantId == tenantId)` in queries. Multi-tenancy is enforced globally in `ApplicationDbContext` via `HasQueryFilter(e => e.TenantId == _tenantContext.TenantId)`.
- Never expose or leak records across tenants. 

## 3. CQRS & MediatR (Module-Wise Development)
When building a new module (e.g., `Leave`, `Payroll`), structure it as follows inside `Workora.Application`:
- **Commands**: Suffix with `Command` (e.g., `CreateEmployeeCommand`). Use C# `record` types.
- **Command Handlers**: Suffix with `CommandHandler`. They perform operations via Repositories and Domain Aggregates, then call `IUnitOfWork.SaveChangesAsync()`.
- **Queries**: Suffix with `Query`. Use C# `record` types.
- **Query Handlers**: Suffix with `QueryHandler`. They fetch data (mapping entities to DTOs) and return it.
- **Pipeline Behaviors**: Always rely on the global pipeline for Validation, Tenant Authorization, and Transactions. Do not manage transactions manually in controllers.

## 4. Domain-Driven Design (DDD)
- Use **Value Objects** (e.g., `Money`, `DateRange`, `EmployeeCode`) instead of primitive obsession.
- Use **Domain Events** (e.g., `LeaveApprovedEvent`) for cross-aggregate side effects. Dispatch them post-commit.
- Inherit from `AuditableEntity` (generates CreatedBy, UpdatedDate, etc.) for entities that require auditing.
- Do NOT use Data Annotations on domain models. Use EF Core Fluent API exclusively in the Persistence layer.

## 5. Security & RBAC
- **Token Model**: JWT with 15-min TTL and opaque refresh tokens.
- **RBAC Policy**: Controllers MUST use policy-based authorization: `[Authorize(Policy = "Module.Action")]` (e.g., `[Authorize(Policy = "Employee.Update")]`).
- **Soft Delete**: Hard deletes are forbidden for critical records. Set `IsDeleted = true`. The Global Query Filter handles hiding soft-deleted records.

## 6. API Response Standards
- Endpoints must return the standardized response envelope:
  ```json
  { "success": true, "message": "...", "data": {} }
  ```
- Do not catch business exceptions in the controller. Let the **Global Exception Middleware** handle them (e.g., mapping `ValidationException` to `400 Bad Request`).

## 7. Code Standards & Naming Conventions
- **C# Version**: C# 13 (.NET 9).
- **Nullability**: Nullable Reference Types (`<Nullable>enable</Nullable>`) are enforced. Do not use `?` on required DB columns.
- **Async/Await**: Append `Async` to method names (e.g., `GetByIdAsync`). Always pass `CancellationToken`. Avoid `.Result` or `.Wait()`.
- **Primary Keys**: Always `UUID` (GUIDs in C#).

## 8. Development Workflow
- When adding a new EF Core configuration or altering an entity, you MUST generate a new migration:
  `dotnet ef migrations add <Name> --project src/Workora.Persistence --startup-project src/Workora.API`
- Write unit tests using **xUnit**, **Moq**, and **FluentAssertions**.
