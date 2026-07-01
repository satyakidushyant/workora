# JWT Implementation

Workora uses JSON Web Tokens (JWT) for stateless, scalable authentication. 

## Token Lifecycle
- **Access Token TTL**: 15 minutes.
- **Algorithm**: `HS256` (HMAC with SHA-256).

## JWT Payload (Claims)
The access token payload is kept minimal to reduce bandwidth, but contains enough denormalized data to avoid hitting the database for authorization checks.

```json
{
  "sub": "e3b0c442-98fc-1c14-9afb-f4c8996fb924", // The UserId
  "email": "user@company.com",
  "tenant_id": "a1b2c3d4-...",                 // The TenantId (crucial for data isolation)
  "role": "HR Manager",                        // The primary role
  "permissions": [                             // Array of strings
    "Employee.View",
    "Employee.Create",
    "Leave.Approve"
  ],
  "jti": "unique-token-id",                    // JWT ID for tracking/revocation
  "exp": 1735689600,                           // Expiration timestamp
  "iss": "WorkoraAPI",
  "aud": "WorkoraClient"
}
```

## Security Considerations
1. **Never store sensitive data**: PII (like Aadhaar/PAN) or passwords are never embedded in the JWT.
2. **Permission Updates**: If a Company Admin changes a user's permissions in the database, the change will not take effect until the access token expires (max 15 mins) and the client fetches a new access token using their refresh token.
3. **Validation**: The ASP.NET Core Authentication Middleware validates the signature, issuer, audience, and expiration strictly before allowing the request into the MVC pipeline.
