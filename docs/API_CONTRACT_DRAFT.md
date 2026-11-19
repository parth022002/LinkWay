# API Contract Draft

Base path: `/api/v1`

| Method | Path | Purpose |
|---|---|---|
| POST | `/links` | Create a link |
| GET | `/links` | List/filter workspace links |
| GET | `/links/:id` | Link details |
| PATCH | `/links/:id` | Update link |
| POST | `/links/:id/qr` | Generate QR |
| GET | `/links/:id/versions` | Version timeline |
| GET | `/analytics/summary` | Aggregated metrics |
| GET | `/analytics/export` | CSV export |
| POST | `/campaigns` | Create campaign |
| POST | `/abuse-reports` | Public abuse report |
| GET | `/:code` | Public redirect resolver |

All private endpoints require authenticated workspace membership and server-side authorization.
Use schema validation, request IDs, consistent error objects and bounded pagination.

Do not expose `GET /:code?url=...` or any equivalent user-controlled open redirect.
