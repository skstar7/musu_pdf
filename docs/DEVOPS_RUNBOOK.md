# DevOps Runbook

## Runtime Components

- Frontend: Vite dev server or static bundle served by Nginx.
- Backend: Spring Boot JAR.
- Worker: FastAPI/Uvicorn.
- Data: MongoDB + Redis.
- Proxy: Nginx.

## Required Versions

- Node.js 20+
- npm 10+
- Java 21
- Maven 3.9+
- Python 3.11 preferred
- Docker + Docker Compose (recommended)

## Environment Variables

Core backend variables:
- `PORT` (default `8080`)
- `MONGODB_URI`
- `REDIS_HOST`
- `REDIS_PORT`
- `STORAGE_ROOT`
- `STORAGE_RETENTION_HOURS`
- `WORKER_BASE_URL`
- `JOB_STORE_MODE` (`mongo` or `memory`)
- `RATE_LIMIT_PER_MINUTE`
- `MAX_FILE_SIZE`
- `MAX_REQUEST_SIZE`

Frontend:
- `VITE_API_BASE_URL`

## Deployment Modes

### Mode A: Local multi-process

Start services separately:
1. Worker
2. Backend
3. Frontend

Use this for rapid development and debugging.

Local fallback option:
- Set `JOB_STORE_MODE=memory` when MongoDB is unavailable.
- Do not use this mode for production deployments.

### Mode B: Docker Compose

Single command stack:
- `docker compose up --build`

Use this for environment consistency.

## Health Verification

Recommended checks:
- Frontend page loads.
- Backend health endpoint returns HTTP 200.
- Worker health endpoint returns HTTP 200.
- MongoDB reachable from backend.
- Redis reachable from backend.

## Logging

Minimum standards:
- Structured logs for backend and worker.
- Request correlation IDs propagated where possible.
- No secret/password logging.

## Security and Compliance

- Restrict worker from public ingress.
- Restrict storage path to dedicated data volume.
- Run cleanup scheduler and validate retention.
- Add WAF/rate-limiter at edge for production.
- Use TLS termination at load balancer or proxy.

## Incident Runbook (Basic)

1. Detect failure (alert or 5xx spike).
2. Identify affected service:
- frontend, backend, worker, db, cache.
3. Check recent deploy or config change.
4. Roll back if needed.
5. Validate recovery with smoke tests.
6. Record postmortem with corrective actions.

## Backup and Recovery

- MongoDB backup schedule and restore test cadence.
- Storage volume snapshot strategy.
- Configuration and secrets backup policy.

## Performance Tuning Notes

- Scale worker before backend for CPU-bound operations.
- Separate storage volume IO from compute where possible.
- Add queue depth metrics for autoscaling triggers.
