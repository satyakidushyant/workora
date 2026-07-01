# Docker & Local Development Setup

To ensure environmental parity and easy onboarding, Workora provides a `docker-compose.yml` file for local development.

## Docker Compose Services

The `docker-compose.yml` spins up the following supporting infrastructure:
1. **PostgreSQL**: The primary relational database (Port `5432`).
2. **Redis**: Used for distributed caching, session state, and Hangfire background queues (Port `6379`).
3. **Mailpit / MailHog**: A local SMTP testing server to catch outbound notification emails without actually sending them to real users. UI available on port `8025`.

## Running Local Infrastructure

From the root of the repository:

```bash
cd docker
docker-compose up -d
```

## Dockerizing the API

While you typically run the API via Visual Studio or `dotnet run` during active development, you can containerize the API itself for staging tests.

The `Dockerfile` located in `src/Workora.API` utilizes multi-stage builds:
1. **Build Stage**: Uses the heavy .NET 9 SDK image to restore packages and publish the release DLLs.
2. **Runtime Stage**: Uses the lightweight .NET 9 ASP.NET runtime Alpine image to run the app, significantly reducing the final image size and attack surface.

```bash
docker build -t workora-api:latest -f src/Workora.API/Dockerfile .
```
