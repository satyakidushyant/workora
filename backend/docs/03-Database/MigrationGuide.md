# EF Core Migration Guide

Workora uses Entity Framework (EF) Core Code-First migrations. Because of the Clean Architecture structure, the DbContext resides in `Workora.Persistence`, but the startup project is `Workora.API`.

## Prerequisites

Ensure you have the EF Core CLI tools installed:
```bash
dotnet tool install --global dotnet-ef
```

## Adding a New Migration

When you alter a domain entity or an EF Core Fluent API configuration, you must generate a new migration.

Execute this command from the **root of the solution**:

```bash
dotnet ef migrations add <MigrationName> --project src/Workora.Persistence --startup-project src/Workora.API
```
*Example: `dotnet ef migrations add AddLeaveBalancesTable --project src/Workora.Persistence --startup-project src/Workora.API`*

## Updating the Database (Development)

To apply pending migrations to your local PostgreSQL database:

```bash
dotnet ef database update --project src/Workora.Persistence --startup-project src/Workora.API
```

## Removing the Last Migration

If you made a mistake and haven't pushed the migration or applied it to the database, you can remove it:

```bash
dotnet ef migrations remove --project src/Workora.Persistence --startup-project src/Workora.API
```

## Generating SQL Scripts for Production

Production databases should **never** be updated using `dotnet ef database update`. Instead, generate an idempotent SQL script and execute it via your CI/CD pipeline or a tool like Flyway/DbUp.

```bash
dotnet ef migrations script -i -o scripts/migration_script.sql --project src/Workora.Persistence --startup-project src/Workora.API
```
*(The `-i` flag ensures the script is idempotent, meaning it checks if the migration was already applied before executing).*

## Handling Multi-Tenancy in Migrations

Since the application uses a shared-database approach, standard EF migrations work perfectly. However, if you are performing **Data Migrations** (e.g., seeding default Leave Types for all existing tenants), you must write raw SQL inside the `Up()` method of the migration to iterate over all `TenantIds` in the `Companies` table.
