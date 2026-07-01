# API Endpoints & Conventions

All endpoints in Workora follow strict RESTful conventions. 

## Base URL
All API routes are versioned. The base URL structure is:
`https://api.workora.io/api/v1/{module}`

## HTTP Methods
- `GET`: Retrieve a resource or a list of resources.
- `POST`: Create a new resource or execute an operation (e.g., login).
- `PUT`: Fully replace/update an existing resource.
- `PATCH`: Partially update an existing resource (used sparingly).
- `DELETE`: Soft-delete a resource.

## Standardized Response Envelope

To simplify frontend parsing and error handling, **every** response is wrapped in a standard JSON envelope.

### Success Response (200 OK, 201 Created)
```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": {
    "id": "e3b0c442-98fc-1c14-9afb-f4c8996fb924",
    "name": "Software Engineer"
  }
}
```

### Error Response (400 Bad Request, 404 Not Found, etc.)
```json
{
  "success": false,
  "message": "Validation Failed",
  "errors": [
    "The FirstName field is required.",
    "Email format is invalid."
  ]
}
```

## Pagination, Sorting, and Filtering

List endpoints accept standard query parameters mapped to a `PagedRequest` object:
- `page`: The page number (default 1).
- `pageSize`: The number of items per page (default 10).
- `sortBy`: The column name to sort by (e.g., `createdDate`).
- `sortDir`: Direction (`asc` or `desc`).

### Paginated Response Payload
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "items": [...],
    "page": 1,
    "pageSize": 10,
    "totalPages": 5,
    "totalRecords": 45
  }
}
```

## Standard HTTP Status Codes
- `200 OK`: Successful read/update/delete.
- `201 Created`: Resource successfully created.
- `202 Accepted`: Asynchronous operation queued (e.g., payroll generation).
- `204 No Content`: Successful operation with no return payload.
- `400 Bad Request`: Validation failure or malformed request.
- `401 Unauthorized`: Missing, invalid, or expired JWT.
- `403 Forbidden`: Authenticated, but lacks the necessary RBAC permission.
- `404 Not Found`: Resource does not exist (or belongs to another tenant).
- `409 Conflict`: Business rule violation or token reuse detected.
- `422 Unprocessable Entity`: Semantic error.
- `423 Locked`: Resource or account is locked.
- `429 Too Many Requests`: Rate limit exceeded.
- `500 Internal Server Error`: Unhandled exception.
