
# 01-Architecture

## CleanArchitecture

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


## FolderStructure

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



# 02-Components

## ComponentGuidelines

# Component Guidelines

To ensure maximum performance and reusability, Workora components are strictly divided into two categories: **Smart (Container)** and **Dumb (Presentational)** components.

## 1. Smart Components (Pages)
Located in `presentation/features/{module}/pages/`.

- **Responsibility**: Connect to the NgRx Store or Signals to fetch state. Dispatch actions to mutate state.
- **Rule**: They should have minimal to no HTML/CSS of their own. Their template should mostly consist of passing `[data]` down to Dumb components and listening to `(events)`.
- **Naming**: Suffixed with `Page` (e.g., `EmployeeListPageComponent`).

## 2. Dumb Components (Presentational)
Located in `presentation/features/{module}/components/` or `presentation/shared/components/`.

- **Responsibility**: Pure UI rendering. 
- **Rule**: They must NEVER inject the Store, HttpClient, or API services.
- **Data Flow**: They receive data solely via `@Input()` and communicate changes solely via `@Output()` EventEmitter.
- **Performance**: Must strictly use `ChangeDetectionStrategy.OnPush`.

```typescript
@Component({
  selector: 'app-employee-card',
  templateUrl: './employee-card.component.html',
  styleUrls: ['./employee-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Mandatory for Dumb Components
})
export class EmployeeCardComponent {
  @Input() employee!: Employee;
  @Output() viewDetails = new EventEmitter<string>();
}
```

## 3. General Best Practices
- **TrackBy**: Always use `trackBy` in `*ngFor` loops to prevent unnecessary DOM destruction/recreation.
- **Async Pipe**: Always use the `| async` pipe in templates to subscribe to Observables. Never `.subscribe()` manually in a component unless absolutely necessary (and if so, manage the teardown in `ngOnDestroy` using `takeUntilDestroyed`).
- **Strict Typing**: Avoid `any` in inputs and outputs. Use the Domain models.



# 03-Routing

## RoutingAndGuards

# Routing and Guards

Workora relies on Angular's Router for navigation, employing **Lazy Loading** and strict **Route Guards** to enforce Role-Based Access Control (RBAC).

## 1. Lazy Loading
Every business feature module (e.g., Attendance, Payroll) must be lazy-loaded. This reduces the initial bundle size and improves Time-to-Interactive (TTI).

```typescript
const routes: Routes = [
  {
    path: 'employees',
    loadChildren: () => import('./features/employees/employees.module').then(m => m.EmployeesModule),
    canMatch: [AuthGuard, RbacGuard],
    data: { requiredPermission: 'Employee.View' }
  }
];
```
*Note: Use `canMatch` instead of `canLoad` in modern Angular to prevent downloading the chunk if the user doesn't have permission to see it.*

## 2. Authentication Guard (`AuthGuard`)
Verifies if the user is logged in by checking the presence and validity of the Access Token in local storage or the NgRx store. If invalid, the user is redirected to the login page.

## 3. RBAC Guard (`RbacGuard`)
Extracts the required permission from the Route `data` object and compares it against the user's `permissions` array (which is decoded from the JWT during login and stored in state).

```typescript
export const RbacGuard: CanMatchFn = (route, segments) => {
  const store = inject(Store);
  const requiredPermission = route.data?.['requiredPermission'];

  return store.select(selectUserPermissions).pipe(
    map(permissions => {
      if (!requiredPermission || permissions.includes(requiredPermission)) {
        return true;
      }
      return false; // Or return a UrlTree to an "Unauthorized" page
    })
  );
};
```

## 4. Resolvers (Discouraged)
Avoid using Angular Route Resolvers (`resolve`) for fetching data unless absolutely necessary for SEO (which doesn't apply to a SaaS dashboard). 
Instead, let the page load instantly and display skeleton loaders while NgRx fetches the data asynchronously. This provides a much better perceived performance.



# 04-StateManagement

## StateManagement

# State Management (NgRx & Signals)

Workora uses a hybrid approach to state management, combining the robust predictability of **NgRx** (Redux pattern) for global state with the reactivity of **Angular Signals** for local component state.

## 1. Global State (NgRx)
Use NgRx for state that is shared across multiple modules or components, such as:
- Authenticated User Profile & Permissions
- Global UI states (e.g., sidebar toggled, theme mode)
- Heavy data collections (e.g., a master list of departments used in multiple dropdowns)

### Architecture of a Slice
- **Actions**: Define the events (`[Employee API] Load Employees Success`).
- **Reducers**: Pure functions mutating state.
- **Effects**: Side-effects (API calls). **Important**: Effects should call Data layer repositories, which return Domain models.
- **Selectors**: Memoized queries fetching slices of state for the UI.

## 2. Local State (Angular Signals)
Use Angular Signals for state that is isolated to a single component or a small widget.
- Toggling a local modal.
- Tracking the currently selected tab.
- Simple counter or form derived values.

```typescript
@Component({...})
export class LocalWidgetComponent {
  // Local state via Signal
  isOpen = signal(false);

  toggle() {
    this.isOpen.update(v => !v);
  }
}
```

## 3. Connecting State to Components
Smart components should inject the NgRx `Store` and use `selectSignal` to seamlessly integrate NgRx with modern Angular templates.

```typescript
@Component({...})
export class EmployeeListPageComponent {
  private store = inject(Store);
  
  // Expose state to the template as a Signal
  employees = this.store.selectSignal(selectAllEmployees);
  isLoading = this.store.selectSignal(selectEmployeeLoading);

  ngOnInit() {
    this.store.dispatch(EmployeeActions.loadEmployees());
  }
}
```



# 05-Styling

## StylingGuidelines

# Styling Guidelines

Workora uses a hybrid styling approach, combining **Angular Material** for core interactive components and **Tailwind CSS** for layout, spacing, and utility styling.

## 1. Angular Material
Use Angular Material components (`MatButton`, `MatTable`, `MatDialog`) for all complex UI elements. This ensures WCAG 2.1 AA accessibility out of the box.

- Do not override Material internal classes (e.g., `.mat-mdc-button`) globally unless absolutely necessary for the theme. Use the Material Theming SCSS API instead.
- Use Material Typography for global text sizes.

## 2. Tailwind CSS
Use Tailwind for all non-Material layout concerns.

- **Spacing & Layout**: Flexbox, CSS Grid, margins, paddings (e.g., `flex flex-col gap-4 p-6`).
- **Responsive Design**: Use Tailwind breakpoints (`md:`, `lg:`) instead of writing custom media queries.
- **Avoid Custom CSS**: Keep `.component.scss` files empty unless you are dealing with complex animations or third-party library overrides. Rely on `@apply` in your stylesheet if you must create a reusable class.

## 3. Dark Mode
The application must support Dark Mode. 
- Ensure your Angular Material theme defines a dark palette.
- Use Tailwind's `dark:` modifier for custom elements (e.g., `bg-white dark:bg-gray-800`).



# 06-API-Integration

## HttpInterceptors

# HTTP Interceptors

In the `core/interceptors/` directory, several functional interceptors manipulate outbound requests and inbound responses.

## 1. JwtInterceptor
Automatically attaches the JWT `Authorization: Bearer <token>` header to all outgoing requests to the Workora API domain. It skips appending the token if the request is to a 3rd-party API (like Cloudinary direct uploads).

## 2. RefreshTokenInterceptor
Listens for `401 Unauthorized` responses from the API.
1. Intercepts the 401 response and pauses any further outgoing requests.
2. Calls the backend `/auth/refresh` endpoint using the locally stored Refresh Token.
3. If successful, updates the local storage and NgRx state with the new Access Token, then replays the paused requests with the new token.
4. If the refresh fails (e.g., token expired or revoked), it forcibly logs the user out and redirects to the login screen.

## 3. GlobalErrorInterceptor
Catches all other HTTP errors (400, 403, 404, 500) and displays a user-friendly toast/snackbar message via the `NotificationService`. 

For `400 Bad Request` validation errors, it can format the `errors[]` array from the standardized API envelope and display them comprehensively.


## MediaUploads

# Media Uploads (Cloudinary)

File and image uploads in Workora are handled via Cloudinary. The frontend communicates with the backend, which acts as the intermediary to Cloudinary.

## Workflow

1. **User Selection**: The user selects a file via a standard `<input type="file">` or a drag-and-drop zone.
2. **FormData**: The file is appended to a native JavaScript `FormData` object.
   ```typescript
   const formData = new FormData();
   formData.append('file', selectedFile);
   ```
3. **API Call**: The Data layer provider issues a `POST` request to the backend with `Content-Type: multipart/form-data`.
   ```typescript
   uploadProfilePicture(employeeId: string, file: File): Observable<UploadResponseDto> {
     const formData = new FormData();
     formData.append('file', file);
     return this.http.post<UploadResponseDto>(`/api/v1/employees/${employeeId}/profile-picture`, formData);
   }
   ```
4. **Backend Processing**: The backend validates the file, uploads it to Cloudinary, stores the URL in PostgreSQL, and returns the URL.
5. **State Update**: The NgRx Effect receives the new URL and updates the `Employee` object in the store.

## Future Optimization (Direct Upload)
For very large files (e.g., 20MB+ PDFs), future updates may implement Direct Uploads. The frontend will request a pre-signed signature from the backend and `POST` directly to the Cloudinary API, bypassing the Workora backend for the binary transfer.



# 07-Deployment

## BuildAndDeploy

# Build & Deployment

The Angular frontend is built into static HTML/JS/CSS assets and served via an NGINX container.

## 1. Environment Variables
Angular's standard `environment.ts` files are compiled at build time. To support running a single Docker image across multiple environments (Dev, Staging, Prod), we use **Runtime Environment Injection**.

A `env.js` file is loaded in `index.html` before the Angular bundles. An entrypoint script in the Docker container replaces the values in `env.js` with actual OS environment variables before starting NGINX.

## 2. Dockerization
The `Dockerfile` utilizes a multi-stage build:

### Stage 1: Build
- Uses `node:20-alpine`.
- Runs `npm ci`.
- Runs `npm run build --configuration production`.

### Stage 2: Serve
- Uses `nginx:alpine`.
- Copies the `dist/workora-ui/browser` folder from Stage 1 to `/usr/share/nginx/html`.
- Replaces the default NGINX configuration to route all 404s to `index.html` to support Angular's HTML5 PushState routing.

## 3. Kubernetes / CDN
In production, the NGINX container is deployed to Kubernetes, and a CDN (like Cloudflare or AWS CloudFront) sits in front of it to cache static assets aggressively, improving load times globally.



