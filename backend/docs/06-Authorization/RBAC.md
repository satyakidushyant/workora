# Role-Based Access Control (RBAC)

Workora implements a strict, policy-based RBAC model. Users are assigned Roles, and Roles contain specific Permissions.

## Permission Naming Convention
Permissions are formatted as `<Module>.<Action>`.
Examples:
- `Employee.View`
- `Employee.Create`
- `Employee.ViewSensitive` (required to view decrypted Aadhaar/PAN)
- `Payroll.Lock`

## Implementation Details
1. **Denormalization in JWT**: During login, the `IIdentityService` fetches all permissions associated with the user's role and embeds them as a JSON array in the `permissions` claim of the JWT.
2. **Policy-Based Authorization**: ASP.NET Core controllers use the standard `[Authorize]` attribute specifying a policy.
   ```csharp
   [Authorize(Policy = "Employee.Update")]
   [HttpPut("{id}")]
   public async Task<IActionResult> UpdateEmployee(...)
   ```
3. **Custom Handler**: A custom `PermissionAuthorizationHandler` inspects the incoming JWT's `permissions` claim. If the requested policy string exists in the array, access is granted.

## Advantages
- Extremely fast authorization (no database lookup required on every API hit).
- The API tier doesn't need to know which Role is allowed to do what; it only cares about Permissions. This allows Company Admins to define highly customized roles for their tenant without requiring code changes.
