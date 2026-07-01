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
