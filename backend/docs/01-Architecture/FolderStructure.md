# Folder Structure

The Workora backend is organized as a single `.sln` solution containing multiple class libraries, adhering to Clean Architecture principles.

```text
Workora.sln

src/
├── Workora.Domain/            (No external dependencies)
│   ├── Common/                (BaseEntity, AuditableEntity, ValueObjects)
│   ├── Entities/              (Employee, Department, LeaveRequest, etc.)
│   ├── Enums/
│   ├── Events/                (Domain Events like LeaveApprovedEvent)
│   └── Exceptions/            (Domain-specific exceptions)
│
├── Workora.Application/       (Depends on Domain)
│   ├── Common/
│   │   ├── Behaviors/         (MediatR Pipeline Behaviors)
│   │   ├── Exceptions/        (ValidationException, NotFoundException)
│   │   ├── Interfaces/        (IMediaService, IUnitOfWork, etc.)
│   │   └── Models/            (PaginatedResponse, Result<T>)
│   └── Modules/               (Feature slices)
│       ├── Employees/
│       │   ├── Commands/
│       │   ├── Queries/
│       │   └── DTOs/
│       └── Payroll/
│
├── Workora.Infrastructure/    (Depends on Application)
│   ├── Authentication/        (JwtTokenGenerator, IdentityService)
│   ├── Services/              (CloudinaryMediaService, EmailService)
│   └── Caching/               (RedisCacheService)
│
├── Workora.Persistence/       (Depends on Application & Domain)
│   ├── Contexts/              (ApplicationDbContext)
│   ├── Configurations/        (EF Core Fluent API configs)
│   ├── Migrations/
│   └── Repositories/          (GenericRepository, EmployeeRepository)
│
└── Workora.API/               (Depends on all, composed via DI)
    ├── Controllers/           (v1/EmployeesController, etc.)
    ├── Middleware/            (ExceptionMiddleware, TenantMiddleware)
    ├── Extensions/            (ServiceCollectionExtensions)
    └── Program.cs

tests/
├── Workora.UnitTests/         (xUnit, Moq for Application & Domain)
└── Workora.IntegrationTests/  (API endpoints, DB interactions, Auth flows)
```

## Dependency Direction

- **API** depends on Application, Infrastructure, Persistence.
- **Infrastructure** depends on Application.
- **Persistence** depends on Application and Domain.
- **Application** depends on Domain.
- **Domain** depends on *nothing*.
