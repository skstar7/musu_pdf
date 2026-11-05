# Team Playbook

## Team Responsibilities

### Frontend Team

Owns:
- UX flows, tool pages, responsive behavior.
- Component consistency and accessibility.
- API client integration and job polling UX.

Must coordinate with backend on:
- Endpoint paths and payload shape.
- Error codes/messages and user-facing mapping.
- Download URL semantics and status transitions.

Definition of done:
- All interactive controls are functional.
- Loading, empty, error, success states are explicit.
- Mobile behavior validated.
- No hardcoded API URLs; env-driven base URL.

### Backend Team

Owns:
- API contracts and validation logic.
- Job orchestration and status transitions.
- Storage safety and cleanup policy enforcement.
- Exception handling and envelope consistency.

Must coordinate with worker on:
- Operation names and config keys.
- Input/output file constraints.
- Error propagation conventions.

Definition of done:
- Contract-documented endpoint and payload behavior.
- Integration tests for submit/status/download lifecycle.
- Security controls validated.
- No document content/password logging.

### DevOps Team

Owns:
- Runtime environments and deployment strategy.
- Secrets management and config injection.
- Monitoring/alerting/log aggregation.
- Backup and incident response runbooks.

Must coordinate with app teams on:
- Environment variable naming and defaults.
- Health check endpoints and SLO/SLA targets.
- Build/release cadence and rollback strategy.

Definition of done:
- Reproducible deployments.
- Observability dashboards and alerts.
- Disaster recovery steps documented and tested.

## Communication Protocol

Use lightweight RFCs for changes in:
- API contracts.
- Worker operation schema.
- Environment variables.
- Security policy.

RFC template:
1. Problem statement.
2. Proposal.
3. Backward compatibility impact.
4. Migration plan.
5. Owners and timeline.

## Branching and Release Model (Recommended)

- `main`: production-ready.
- `develop`: integration branch.
- Feature branches: `feat/<scope>`.
- Hotfix branches: `hotfix/<scope>`.

Release gates:
- Unit + integration checks pass.
- API docs updated.
- Security checklist reviewed.
- Deployment checklist approved.

## Cross-Team Acceptance Checklist

Before merging any tool feature:
- Frontend route and config implemented.
- Backend endpoint mapped and validated.
- Worker operation present and tested.
- API reference updated.
- Runbook impact documented.
