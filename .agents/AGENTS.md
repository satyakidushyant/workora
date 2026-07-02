# Workora Backend Coding Standards

When creating an API or writing backend code for the Workora project, you MUST adhere to the following architecture and coding standards, as defined in `backend/docs/TechnicalDocument.md` and `backend/docs/CodeStructure.md`.

## 1. Clean Architecture & CQRS
- **Dependency Rule**: The Domain layer has zero external dependencies. The Application layer depends only on Domain. The Infrastructure and Persistence layers depend on Application/Domain. The API layer depends on Application. 
- **CQRS**: Use MediatR to separate read (Queries) from write (Commands).
- **Vertical Slice**: Inside `src/Workora.Application/Features/{Module}/`, group related files by use case (e.g., one folder per Command or Query). A typical folder structure for a use case is:
  - `CreateEmployee/CreateEmployeeCommand.cs`
  - `CreateEmployee/CreateEmployeeCommandHandler.cs`
  - `CreateEmployee/CreateEmployeeCommandValidator.cs`

## 2. API Layer (Controllers)
- Controllers must be extremely thin and act only as routers to MediatR.
- **No Infrastructure in Controllers**: Never inject `DbContext`, Repositories, or Infrastructure services directly into a Controller. Only inject `IMediator`.
- **Response Format**: Always wrap responses in `ApiResponse<T>.Success()` or `ApiResponse<T>.Fail()`. Return `PagedResponse<T>` for paginated lists.
- **Authorization**: Secure every state-changing endpoint using Policy-based permissions (e.g., `[Authorize(Policy = "employees.create")]`). Do not use raw Roles directly in the `[Authorize]` attribute.

## 3. Application Layer
- Handlers (`IRequestHandler`) contain the orchestration logic. Do not duplicate cross-cutting concerns (validation, logging, transactions) in handlers; rely on the existing MediatR Pipeline Behaviors.
- Validators must use **FluentValidation** and be placed in the same folder as the Command/Query. They are invoked automatically by the pipeline.
- DTOs map domain entities for API responses. Map entities using `AutoMapper` profiles.

## 4. Domain Layer
- **Rich Domain Models**: Create behavior-rich entities. Business rules and invariants should be inside the domain entity, not just the handler.
- **Base Classes**: Most aggregate roots should inherit from `AuditableEntity` (which provides soft delete and audit columns).
- **Repositories**: Define repository interfaces (`IEmployeeRepository`) in the Domain layer, not the Persistence layer.
- Raise **Domain Events** for side effects (e.g., sending an email after entity creation) instead of coupling logic inside the handler.

## 5. Persistence & Infrastructure Layers
- **EF Core Configuration**: Apply entity configurations via `IEntityTypeConfiguration<T>` in `Persistence/Configurations`, keeping `AppDbContext` clean.
- Implement Repository interfaces here. Only add aggregate-specific queries; rely on `GenericRepository` for standard CRUD.

## 6. Naming Conventions & Project Structure
- Adhere to the `Workora.*` naming convention (e.g., `Workora.API`, `Workora.Application`). Do not use the string "HRMS".
- Keep database tables in `snake_case` (EF Core handles mapping automatically) and C# code in standard `PascalCase`.
- DTO names should end with `Dto`.

## 7. Commenting Standards
- **Mandatory Comments**: Every class, method, property, and significant section of code MUST include descriptive comments (e.g., XML documentation comments in C#) explaining its purpose and behavior.
- **Code Generation Requirement**: Whenever you generate or modify code, you MUST add these comments to maintain the standard. Do NOT skip comments for brevity.

## 8. Enums
- **Strong Typing**: Always use Enums for state, status, and categorical fields instead of raw strings or integers.
- **Placement**: Define Enums in the `Workora.Domain/Enums` namespace so they are accessible to both Domain and Application layers.

## 9. Middleware and Filters
- **Cross-Cutting Concerns**: Implement all cross-cutting concerns (e.g., exception handling, correlation IDs, logging) as custom Middleware or Action Filters.
- **Exception Handling**: Use the Global Exception Middleware to translate application/domain exceptions into standardized `ErrorResponse` payloads.

## 10. API Responses and DTOs
- **ApiResponse Wrapper**: Every controller action MUST return its payload wrapped in `ApiResponse<T>.Success()` or `ApiResponse<T>.Fail()`.
- **Paged Responses**: Use `PagedResponse<T>` for any endpoint returning a list or collection.
- **Use DTOs**: Never return Domain Entities directly from an API. Always map entities to Data Transfer Objects (DTOs) using AutoMapper, and return the DTO.
