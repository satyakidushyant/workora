# Local Setup Guidelines

Follow these steps to run the Workora backend locally on your machine.

## Prerequisites
1. **.NET 9 SDK**: Ensure you have the latest .NET 9 SDK installed.
2. **Docker Desktop**: Required to run the local dependencies (Postgres, Redis).
3. **IDE**: Visual Studio 2022, JetBrains Rider, or VS Code with the C# Dev Kit.

## Step 1: Start Dependencies
Navigate to the root `docker` directory and spin up the infrastructure:
```bash
cd docker
docker-compose up -d
```
This starts PostgreSQL on `5432` and Redis on `6379`.

## Step 2: Environment Variables / User Secrets
Do not put your local database passwords or Cloudinary secrets in `appsettings.Development.json` directly if you plan to commit them. Use .NET User Secrets instead.

From the `src/Workora.API` directory:
```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=workora_db;Username=postgres;Password=yourpassword"
dotnet user-secrets set "CloudinarySettings:ApiKey" "YOUR_API_KEY"
```

## Step 3: Apply Database Migrations
Ensure the database schema is created and up to date.
From the root of the solution:
```bash
dotnet ef database update --project src/Workora.Persistence --startup-project src/Workora.API
```

## Step 4: Run the API
Run the application from Visual Studio, or via CLI:
```bash
cd src/Workora.API
dotnet run
```
The API will start. Navigate to `https://localhost:<port>/swagger` in your browser to test the endpoints.
