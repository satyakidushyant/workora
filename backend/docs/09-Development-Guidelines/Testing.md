# Testing Guidelines

Workora mandates a high standard of automated testing to ensure the stability of the HRMS and Payroll engines. We use **xUnit** as our test framework, **Moq** for mocking dependencies, and **FluentAssertions** for readable assertions.

## 1. Unit Tests (`Workora.UnitTests`)
Unit tests focus on isolated pieces of business logic. They do not connect to a real database or external API.

### Target Areas:
- **Domain Entities**: Test business methods on Aggregate Roots (e.g., `employee.Promote(...)`).
- **Application Handlers**: Test MediatR Command and Query handlers by mocking the Repositories and external services.
- **Validators**: Ensure FluentValidation rules correctly identify valid and invalid DTOs.

### Example (FluentAssertions):
```csharp
[Fact]
public void ApproveLeave_WithValidState_UpdatesStatus()
{
    // Arrange
    var request = new LeaveRequest(...);
    
    // Act
    request.Approve();
    
    // Assert
    request.Status.Should().Be(LeaveStatus.Approved);
}
```

## 2. Integration Tests (`Workora.IntegrationTests`)
Integration tests verify that the various layers of the application work together correctly, particularly focusing on Database and API interactions.

### Target Areas:
- **Repositories**: Verify that custom EF Core LINQ queries translate to SQL correctly and return the expected results.
- **API Endpoints**: Use `WebApplicationFactory` to spin up an in-memory test server. Send HTTP requests and assert the JSON responses and HTTP status codes.
- **Tenant Isolation**: Write specific tests that log in as Tenant A, attempt to fetch a resource belonging to Tenant B, and assert that a `404 Not Found` is returned.

### Database Fixtures:
Integration tests should use **Testcontainers** (spinning up a disposable PostgreSQL Docker container per test run) or the EF Core In-Memory database provider (though Testcontainers is preferred for absolute fidelity).
