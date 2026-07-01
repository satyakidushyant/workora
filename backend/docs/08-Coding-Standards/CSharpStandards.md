# C# Coding Standards

The Workora backend is written in C# 13 targeting .NET 9. Strict adherence to these standards ensures maintainability.

## 1. Clean Architecture Enforcement
- **Domain First**: Never reference EF Core, ASP.NET Core (`Microsoft.AspNetCore.*`), or any external Nuget package inside the `Workora.Domain` project.
- **Thin Controllers**: API Controllers must not contain business logic or raw EF Core queries. They must solely map HTTP requests to MediatR commands/queries.

## 2. Records and Value Objects
- Use C# `record` types for all DTOs, Commands, and Queries to ensure immutability by default.
  ```csharp
  public record CreateEmployeeCommand(string FirstName, string LastName, Guid DepartmentId) : IRequest<Result<Guid>>;
  ```
- Use Value Objects in the Domain for things like `Money`, `Address`, or `DateRange` instead of primitive obsession.

## 3. Asynchronous Programming
- Always append `Async` to the name of asynchronous methods (e.g., `SaveEmployeeAsync`).
- Always pass the `CancellationToken` down the entire call stack to the database or external API.
- Use `await` instead of `.Result` or `.Wait()` to prevent thread pool starvation.

## 4. Nullability
- **Nullable Reference Types (NRT)** are enabled globally `<Nullable>enable</Nullable>`.
- Pay attention to compiler warnings. If a property in a Domain entity is not nullable in the database, do not mark it with `?`. Initialize it via the constructor.

## 5. Dependency Injection
- Do not use the `new` keyword to instantiate services. Always inject interfaces via the constructor.
- Use `Scoped` lifetime for services that hold state per request (like `ITenantContext`).
- Use `Transient` for lightweight stateless services.
- Use `Singleton` only for caching or truly stateless application-wide services.
