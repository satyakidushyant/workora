# Workora AI Coding Rules

You are an AI coding assistant generating code for the **Workora** HRMS & Payroll Platform. Workora relies on strict Clean Architecture principles for both its Backend and Frontend. You must always adhere to the following rules when working in this workspace.

---

## 1. Backend (ASP.NET Core / C# 13)
Workora uses **Clean Architecture**, **CQRS (MediatR)**, and **Domain-Driven Design (DDD)**.
- **Layers**: `Domain` (No external dependencies) -> `Application` (CQRS, MediatR, FluentValidation) -> `Infrastructure` (External integrations) -> `Persistence` (EF Core) -> `API` (Thin controllers).
- **Multi-Tenancy**: The DB uses a Shared-Database, Shared-Schema model. Multi-tenancy is enforced globally via `ApplicationDbContext` with `HasQueryFilter(e => e.TenantId == _tenantContext.TenantId)`. Do NOT manually filter by `TenantId` in query handlers. Ensure every tenant entity implements `IMustHaveTenant`.
- **CQRS**: Commands (`Record` + `CommandHandler`) mutate state and save via `IUnitOfWork`. Queries (`Record` + `QueryHandler`) fetch state without mutations.
- **Security**: Policy-based RBAC. Controllers must use `[Authorize(Policy = "Module.Action")]`. Never hard-delete critical records; use `IsDeleted = true`.
- **Primary Keys**: Always use `UUID` (`Guid` in C#).
- **Responses**: Always use the standardized response envelope format (`success`, `message`, `data`).
- **Middlewares & Pipelines**: Rely on MediatR pipeline behaviors (Logging, Validation, TenantAuth, Transaction) in the Application layer, and Global Middlewares (Exception, Rate Limiting, Correlation ID) in the API layer.

## 2. Frontend (Angular 20+)
Workora uses **Angular Clean Architecture** with **NgRx** & **Signals**.
- **Layers**: `Domain` (Pure TS models, abstract Repositories, Use Cases) -> `Data` (API Services, DTOs, Mappers) -> `Presentation` (Components, Routing, NgRx State).
- **State Management**: Use **NgRx** for global cross-module state (Actions, Reducers, Selectors, Effects bridging to Data layer). Use **Angular Signals** (`signal`, `computed`) for local component state.
- **Components**: 
  - *Smart Components* (Pages) connect to the Store, dispatch actions, and use `store.selectSignal()`. They have minimal HTML/CSS.
  - *Dumb Components* (Presentational) rely solely on `@Input`/`@Output` and MUST use `ChangeDetectionStrategy.OnPush`. Never inject HttpClient or the Store into Dumb Components.
- **Routing**: All modules must be lazy-loaded. Use `AuthGuard` and `RbacGuard` with route `data: { requiredPermission: '...' }`.
- **Styling**: Use Angular Material strictly for complex UI components (do not override its internal classes). Use Tailwind CSS for all layout, spacing, and dark mode (`dark:` modifier).
- **HTTP**: Never use `HttpClient` directly in components. API requests must originate from Data layer Repositories called by NgRx Effects. Interceptors handle JWTs and Token Refresh.
