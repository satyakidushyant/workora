# Workora

> Enterprise HRMS & Payroll Platform built with ASP.NET Core Clean Architecture.

## Overview

Workora is a modern, scalable, enterprise-grade Human Resource Management System (HRMS) and Payroll platform built using Clean Architecture, Domain-Driven Design (DDD), CQRS, and SOLID principles.

## Technology Stack

| Layer | Technology |
|--------|------------|
| Backend | ASP.NET Core 9 Web API |
| Database | PostgreSQL |
| ORM | Entity Framework Core |
| Architecture | Clean Architecture |
| Pattern | CQRS + MediatR |
| Authentication | JWT + Refresh Token |
| Authorization | RBAC + Policy-Based |
| Validation | FluentValidation |
| Mapping | AutoMapper |
| Logging | Serilog |
| Cache | Redis |
| Message Broker | RabbitMQ / Kafka |
| Load Balancer | NGINX / YARP |
| Storage | Cloudinary |
| Documentation | Swagger / OpenAPI |
| Testing | xUnit, Moq, FluentAssertions |
| Containerization | Docker & Kubernetes |

## Solution Structure

```text
Workora.sln

src/
├── Workora.API
├── Workora.Application
├── Workora.Domain
├── Workora.Infrastructure
└── Workora.Persistence

tests/
├── Workora.UnitTests
└── Workora.IntegrationTests

docs/
├── Workora_Comprehensive_Docs.md
├── Workora_Technical.md
├── Workora_README.md
└── assets/
```

## Documentation Folder

```text
docs/
├── Workora_Comprehensive_Docs.md (Merged architecture & guidelines)
├── Workora_Technical.md (SRS, API Spec, Database Design)
├── Workora_README.md (This file)
└── assets/ (Diagrams and images)
```

## Project Layers

- **Domain** – Business entities, value objects, domain events.
- **Application** – CQRS, commands, queries, handlers, validators, DTOs.
- **Persistence** – EF Core, DbContext, repositories, migrations.
- **Infrastructure** – JWT, Redis, Email, Storage, external integrations.
- **API** – Controllers, middleware, Swagger, versioning, health checks.

## Core Modules

- Employee Management
- Department Management
- Attendance
- Leave Management
- Payroll
- Recruitment
- Performance Management
- Organization Structure
- RBAC
- Notifications
- Reports & Dashboard

## Coding Standards

- Clean Architecture
- SOLID Principles
- Domain-Driven Design
- CQRS
- Repository Pattern
- Unit of Work
- Dependency Injection
- Async/Await
- XML Documentation
- Microsoft C# Naming Standards

## Goal

Build a scalable, secure, maintainable, enterprise-grade HRMS & Payroll platform.
