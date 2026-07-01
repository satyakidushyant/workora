# Non-Functional Requirements (NFR)

## Performance & Scalability (`NFR-PERF`)
- **P95 Response Time:** API response time must be `< 2s` for standard CRUD and read operations under nominal load.
- **Concurrency:** The platform must support `≥ 1,000` concurrent active users per deployment.
- **Database Scalability:** The attendance table must sustain `≥ 1,000,000` records with sub-second indexed query performance.
- **Batch Processing:** A payroll batch run for a 1,000-employee tenant must complete within `10 minutes`.
- **Stateless Tier:** API tier must be horizontally scalable. Session and rate limit state stored in Redis.

## Security & Compliance (`NFR-SEC`)
- **Authentication:** JWT access tokens (15-min TTL) combined with rotating, opaque refresh tokens.
- **MFA:** Optional Time-Based One-Time Password (TOTP) MFA support, enforceable per tenant policy.
- **Cryptography:** Passwords hashed with `Argon2id` or ASP.NET Identity PBKDF2 (V3).
- **Data at Rest:** Sensitive PII columns (PAN, Aadhaar, Bank Details) must be encrypted at rest in PostgreSQL.
- **Data in Transit:** TLS 1.2+ mandatory for all internal and external communication.
- **Rate Limiting:** API requests must be rate-limited per tenant and per user IP.

## Availability & Reliability (`NFR-AVAIL`)
- **Uptime Target:** 99.9% availability (approximately 8.7 hours downtime per year).
- **Disaster Recovery:** Continuous WAL archiving to blob storage + daily full logical backups, with a minimum 30-day retention policy.
- **Idempotency:** Payroll generation and financial mutations must be idempotent and fully transactional. If a failure occurs mid-transaction, the system must safely rollback.

## Maintainability & Architecture (`NFR-MAINT`)
- **Clean Architecture:** Strict boundary enforcement. Domain layer has no dependencies. No business logic in controllers.
- **Test Coverage:** Minimum `70%` unit test coverage on Application-layer command/query handlers and Domain models.
- **Audit Logging:** All mutating endpoints (`POST`, `PUT`, `DELETE`, `PATCH`) must write to an append-only audit store containing actor, timestamp, action, and JSON diff payload.

## Localization & Accessibility (`NFR-LOC`)
- **Multi-tenant Configurations:** Timezone and base currency are configured at the tenant level.
- **i18n:** Notification templates and UI must support multi-language string interpolation keys.
- **Accessibility:** UI components for employee self-service must target WCAG 2.1 AA compliance.
