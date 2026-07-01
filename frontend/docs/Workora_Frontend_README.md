# Workora Frontend

> Enterprise Angular Frontend Architecture for the Workora HRMS & Payroll Platform.

## Overview

This project follows a scalable Angular Clean Architecture using feature modules, a Core/Shared pattern, lazy loading, and strong separation of concerns. It is designed to integrate with the Workora ASP.NET Core backend.

## Technology Stack

| Component | Technology |
|---|---|
| Framework | Angular 20+ |
| Language | TypeScript |
| UI | Angular Material + Tailwind CSS |
| State Management | NgRx (or Angular Signals where appropriate) |
| Authentication | JWT + Refresh Token |
| HTTP | HttpClient + Interceptors |
| Forms | Reactive Forms |
| Charts | ApexCharts |
| Testing | Jasmine + Karma |

## Project Structure

```text
workora-ui/

src/
├── app/
│   ├── core/
│   │   ├── authentication/
│   │   ├── authorization/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── services/
│   │   ├── constants/
│   │   ├── enums/
│   │   ├── helpers/
│   │   └── configuration/
│   ├── shared/
│   │   ├── components/
│   │   ├── directives/
│   │   ├── pipes/
│   │   ├── validators/
│   │   ├── interfaces/
│   │   ├── models/
│   │   └── services/
│   ├── features/
│   │   ├── dashboard/
│   │   ├── employees/
│   │   ├── departments/
│   │   ├── attendance/
│   │   ├── leave/
│   │   ├── payroll/
│   │   ├── recruitment/
│   │   ├── performance/
│   │   ├── settings/
│   │   └── users/
│   ├── shell/
│   └── app.config.ts
├── assets/
├── environments/
└── styles/
```

## Feature Module Structure

```text
employees/
├── components/
├── pages/
├── services/
├── models/
├── interfaces/
├── state/
│   ├── actions/
│   ├── reducers/
│   ├── effects/
│   └── selectors/
├── employee.routes.ts
└── employee.module.ts
```

## Core Module

- Authentication
- Authorization
- Guards
- HTTP Interceptors
- Global Services
- Constants
- Enums
- Helpers

## Shared Module

- Reusable Components
- Pipes
- Directives
- Validators
- Shared Services
- Common Models & Interfaces

## Shell

- Navbar
- Sidebar
- Footer
- Breadcrumb
- Notifications

## HTTP Interceptors

- JWT Token
- Refresh Token
- Global Error Handler
- Loading Indicator
- Request Logger

## Core Features

- Dashboard
- Employee Management
- Department Management
- Attendance
- Leave
- Payroll
- Recruitment
- Performance
- Settings
- User & Role Management

## Development Guidelines

- Lazy load every feature.
- Use Reactive Forms.
- Never call HttpClient directly from components.
- Keep business logic inside services/state.
- Use strongly typed interfaces and models.
- Reuse shared components.
- Follow Angular Style Guide.

## Repository Structure

```text
workora/
├── backend/
├── frontend/
├── database/
├── docker/
├── docs/
├── scripts/
├── .github/
├── README.md
├── CHANGELOG.md
└── ROADMAP.md
```

## Goal

Build a scalable, maintainable, enterprise-grade Angular application that aligns with the Workora backend architecture.
