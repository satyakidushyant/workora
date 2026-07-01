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
