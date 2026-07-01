# Kubernetes Production Deployment

Workora is designed to run in orchestrated container environments like Kubernetes (Amazon EKS, Azure AKS).

## Architecture

The deployment consists of two primary scalable workloads:
1. **API Tier (Web)**: Serves incoming HTTP traffic.
2. **Worker Tier (Background)**: Runs Hangfire/Quartz background jobs (e.g., payroll generation, email dispatch).

### 1. API Deployment
- **Horizontal Pod Autoscaling (HPA)**: The API Deployment scales based on CPU utilization (target 70%) and incoming request rates.
- **Liveness/Readiness Probes**: Configured to hit `/health/live` and `/health/ready`. Traffic is only routed to pods where the database and Redis are confirmed reachable.
- **Ingress**: An Ingress Controller (e.g., NGINX) handles SSL termination and routes traffic to the API Service.

### 2. Worker Deployment
- Deploys the exact same Docker image as the API, but starts via a different entrypoint or configuration flag that disables the HTTP listener and only boots the Hangfire Server.
- Autoscales based on queue depth (e.g., using KEDA) rather than CPU.

## Configuration & Secrets
- **ConfigMaps**: Store non-sensitive environment variables (e.g., `Serilog__MinimumLevel`, `Cloudinary__CloudName`).
- **Secrets**: Passwords, connection strings, JWT Secrets, and Cloudinary API Secrets are injected securely via Kubernetes Secrets (backed by Azure Key Vault or AWS Secrets Manager).

## Database Migrations
Migrations are executed via an Init Container or a separate pre-deploy Kubernetes Job running an idempotent SQL script (`migration_script.sql`). The API pods should *never* automatically call `context.Database.Migrate()` on startup in production, as concurrent pods will cause race conditions and database corruption.
