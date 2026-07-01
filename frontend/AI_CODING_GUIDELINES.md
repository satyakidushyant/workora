# Workora Frontend - AI Coding Guidelines

> **AI INSTRUCTION:** You MUST strictly follow these guidelines when analyzing, modifying, or generating code for the Workora Angular frontend. Workora uses a strict **Clean Architecture** setup combined with **NgRx / Angular Signals** for state management and **Module-Wise Lazy Loading**.

---

## 1. Architecture & Layers
- **Domain Layer (`src/app/domain`)**: The core. Pure TypeScript ONLY. NO Angular or NgRx imports (except `InjectionToken`). Contains Business Models/Entities, Abstract Repository Interfaces, and pure Use Cases.
- **Data Layer (`src/app/data`)**: Implements the Domain interfaces. Contains API Services (using `HttpClient`), DTOs, and Mappers (`DTO -> Domain Model`).
- **Presentation Layer (`src/app/presentation`)**: Contains the UI (Smart/Dumb components), Routing, and State Management (NgRx Actions/Reducers/Effects).
- **Dependency Rule**: `Presentation -> Data -> Domain`. Never the reverse.

## 2. Component Design
- **Smart Components (Pages)**: Reside in `presentation/features/{module}/pages/`. Connect to the NgRx Store or Signals. Dispatch actions. Keep HTML/CSS minimal. Name them with a `Page` suffix (e.g., `EmployeeListPageComponent`).
- **Dumb Components (Presentational)**: Reside in `presentation/features/{module}/components/` or `presentation/shared/components/`. 
  - MUST use `ChangeDetectionStrategy.OnPush`.
  - Data flows strictly via `@Input()` and `@Output()`. 
  - NEVER inject the Store, `HttpClient`, or Services into a Dumb Component.

## 3. State Management (NgRx & Signals)
- **Global State (NgRx)**: Use for data shared across modules (e.g., Auth User, Master Data). Structure: Actions, Reducers, Selectors, and Effects.
- **Effects**: NgRx Effects bridge the Presentation and Data layers. They must call the API services from the `Data` layer.
- **Local State (Signals)**: Use Angular Signals (`signal()`, `computed()`) for local component UI state (e.g., toggles, counters, form states).
- In smart components, use `store.selectSignal()` to seamlessly consume NgRx state in templates.

## 4. Routing & RBAC
- **Lazy Loading**: Every feature module must be lazy-loaded. Use `canMatch` instead of `canLoad` or `canActivate`.
- **RBAC**: Guard routes using `AuthGuard` and `RbacGuard`. Configure the required permission in the route data:
  ```typescript
  {
    path: 'employees',
    loadChildren: () => import('...').then(m => m.EmployeesModule),
    canMatch: [AuthGuard, RbacGuard],
    data: { requiredPermission: 'Employee.View' }
  }
  ```

## 5. Styling & Theming
- **Angular Material**: Use for all complex interactive elements (`MatTable`, `MatDialog`, etc.). Do NOT override internal Material classes globally.
- **Tailwind CSS**: Use exclusively for layout, spacing, flexbox, grid, and responsiveness (`flex`, `p-4`, `md:gap-6`).
- **Dark Mode**: Support dark mode natively using Tailwind's `dark:` modifier (e.g., `bg-white dark:bg-gray-800`).

## 6. HTTP & API Integrations
- NEVER call `HttpClient` directly from components. API calls must go through the Data Layer Repositories, triggered by NgRx Effects.
- The app uses interceptors for:
  - **JWT Injection** (`JwtInterceptor`)
  - **Token Rotation & Refresh** (`RefreshTokenInterceptor`)
  - **Global Error Handling** (`GlobalErrorInterceptor` - formats `400 Bad Request` messages).
- Uploads (e.g., Cloudinary via backend) use `FormData` and `multipart/form-data`.

## 7. Development Guidelines
- Always use the `| async` pipe or Signals in templates. Do NOT manually `.subscribe()` in components unless required (use `takeUntilDestroyed` if you do).
- Use `trackBy` in all `*ngFor` loops.
- Use strict typing. Avoid `any`. Map API DTOs cleanly to Domain Models using mapper functions.
