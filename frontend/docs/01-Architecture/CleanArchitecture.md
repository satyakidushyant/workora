# Clean Architecture in Angular

Workora's frontend strictly adheres to Clean Architecture principles, ensuring that business logic is decoupled from external APIs, state management frameworks, and the UI layer.

## The Three Layers

### 1. Domain Layer (`domain/`)
The absolute core of the frontend application. This layer must **never** import anything from `@angular/core` (except perhaps `InjectionToken`), `@ngrx`, or `rxjs/ajax`. 
- **Models/Entities**: TypeScript interfaces representing the business objects (e.g., `Employee`, `LeaveRequest`).
- **Repositories (Interfaces)**: Abstract definitions of how data is fetched or mutated (e.g., `EmployeeRepository`). 
- **Use Cases**: Pure functions or classes that execute business rules.

### 2. Data Layer (`data/`)
This layer implements the abstract interfaces defined in the Domain layer. It is responsible for communicating with the outside world.
- **Providers / API Services**: Angular `@Injectable()` services that use `HttpClient` to call the Workora backend. They implement the Domain repository interfaces.
- **DTOs & Mappers**: Interfaces representing the exact JSON structure returned by the API, and mapper functions to convert DTOs into Domain Models.

### 3. Presentation Layer (`presentation/`)
This layer is purely responsible for displaying data and capturing user input. It knows nothing about `HttpClient` or REST endpoints.
- **Features**: Smart and Dumb components grouped by business feature (e.g., `attendance`, `payroll`).
- **State Management**: NgRx Actions, Reducers, Selectors, and Effects. Effects act as the bridge between Presentation and Domain/Data by calling Use Cases or Repositories.
- **Shared UI**: Reusable buttons, dialogs, pipes, and directives.

## Dependency Direction
`Presentation` ➔ `Data` (via DI) ➔ `Domain`
`Data` and `Presentation` depend on `Domain`. `Domain` depends on nothing.
