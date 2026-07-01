# Folder Structure

The Workora frontend (`workora-ui/src/app`) is organized to reflect Strict Clean Architecture.

```text
src/app/
├── core/                       (Singleton app-wide services, interceptors, guards)
│   ├── interceptors/
│   ├── guards/
│   └── services/               (e.g., ThemeService, NotificationService)
│
├── data/                       (Implementation of Domain repositories)
│   ├── dtos/                   (API response shapes)
│   ├── mappers/                (DTO -> Model converters)
│   └── repositories/           (API services implementing Domain interfaces)
│
├── domain/                     (Pure TypeScript, no Angular/NgRx imports)
│   ├── models/                 (Business entities: Employee, LeaveRequest)
│   ├── repositories/           (Abstract interfaces: IEmployeeRepository)
│   └── usecases/               (Business logic functions/classes)
│
└── presentation/               (UI, Routing, and State)
    ├── layouts/                (Shell: Sidebar, Navbar, Footer)
    ├── shared/                 (Reusable UI: Buttons, Pipes, Directives)
    └── features/               (Business modules)
        ├── dashboard/
        ├── employees/
        │   ├── components/     (Dumb/Presentational components)
        │   ├── pages/          (Smart/Container components)
        │   └── state/          (NgRx Actions, Reducers, Effects, Selectors)
        ├── attendance/
        ├── leave/
        ├── payroll/
        └── ...
```

## Module Boundaries
- **Features** should be Lazy Loaded.
- A feature in `presentation/features/employees` should NEVER import directly from `presentation/features/payroll`. If they must share data, it should be done via global state or the `Domain` layer.
- **State** (NgRx) lives inside `presentation` because State is essentially a local database for the UI. The State Effects will interact with the `Data` layer repositories.
