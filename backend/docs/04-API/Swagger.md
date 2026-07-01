# Swagger & OpenAPI Configuration

Workora uses Swagger (Swashbuckle.AspNetCore) to generate interactive API documentation based on OpenAPI 3.0 specifications.

## Accessing Swagger
In the Development environment, the Swagger UI is available at:
`https://localhost:<port>/swagger`

> [!WARNING]
> Swagger UI is intentionally disabled in Production environments for security reasons.

## Authentication in Swagger
Because the API requires JWT authentication, you must provide a valid token to test the endpoints.

1. Generate a token via the `POST /api/v1/auth/login` endpoint in the UI.
2. Copy the `accessToken` from the response.
3. Scroll to the top of the Swagger UI page and click the **Authorize** button.
4. Enter `Bearer <your_token_here>` (Note the space after the word "Bearer").
5. Click **Authorize**.

All subsequent requests made via the "Try it out" button will automatically inject the `Authorization: Bearer ...` header.

## Generating OpenAPI Specifications
For frontend contract-first development (e.g., generating Angular services using tools like `openapi-generator`), you can fetch the raw JSON specification:
`https://localhost:<port>/swagger/v1/swagger.json`
