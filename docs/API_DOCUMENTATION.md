# LinkWay — API Contract & Endpoint Documentation

**Base URL:** `/api/v1`  
**Authentication:** Cookie Session (`linkway_session`) or `Authorization: Bearer <token>`  
**Date:** November 2026  

---

## 1. Authentication & Session Endpoints

### `POST /api/v1/auth/signup`
Creates a new user account and sets an active session cookie.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "name": "Jane Doe"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "user": {
      "id": "cuid...",
      "email": "user@example.com",
      "name": "Jane Doe"
    },
    "workspace": {
      "id": "cuid...",
      "name": "Jane Doe's Workspace",
      "slug": "jane-does-workspace"
    }
  }
  ```

### `POST /api/v1/auth/login`
Authenticates credentials and establishes a session cookie.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response (200 OK):** User object and session confirmation.

### `POST /api/v1/auth/logout`
Terminates the current session and clears the session cookie.
- **Response (200 OK):** `{ "success": true }`

### `GET /api/v1/auth/me`
Retrieves current authenticated user, active workspace, and memberships.
- **Response (200 OK):**
  ```json
  {
    "user": { "id": "...", "email": "...", "name": "..." },
    "activeWorkspace": { "id": "...", "name": "...", "role": "OWNER" },
    "workspaces": [...]
  }
  ```

---

## 2. Links Endpoints

### `GET /api/v1/links`
Lists links within the active workspace.
- **Query Parameters:**
  - `search` (optional string): Filters by title, code, or destination.
  - `status` (optional string): `ACTIVE`, `PAUSED`, `ARCHIVED`, `DELETED`.
  - `campaignId` (optional string): Filters by associated campaign.
  - `page` (optional integer, default 1).
  - `limit` (optional integer, default 20, max 100).
- **Response (200 OK):**
  ```json
  {
    "links": [
      {
        "id": "cuid...",
        "code": "launch26",
        "title": "Summer Launch Page",
        "destinationUrl": "https://example.com/summer?utm_source=twitter",
        "status": "ACTIVE",
        "redirectCode": 302,
        "createdAt": "2026-11-19T10:00:00.000Z",
        "clickCount": 42
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 1 }
  }
  ```

### `POST /api/v1/links`
Creates a new short link with collision detection and destination validation.
- **Request Body:**
  ```json
  {
    "destinationUrl": "https://example.com/landing?utm_source=newsletter",
    "title": "Newsletter Link",
    "customCode": "news-nov26",
    "campaignId": "cuid...",
    "expiresAt": "2026-12-31T23:59:59.000Z"
  }
  ```
- **Response (201 Created):** Full link object with canonical short URL.

### `GET /api/v1/links/:id`
Retrieves full details of a specific link, including current version and stats.

### `PATCH /api/v1/links/:id`
Updates title, destination URL, or status. Updating `destinationUrl` automatically writes a snapshot to `LinkVersion`.
- **Request Body:**
  ```json
  {
    "destinationUrl": "https://example.com/updated-landing",
    "title": "Updated Title",
    "status": "ACTIVE",
    "changeReason": "Updated to point to v2 campaign"
  }
  ```
- **Response (200 OK):** Updated link object.

### `DELETE /api/v1/links/:id`
Soft-deletes or archives a link. Deleted links cease to resolve.

### `GET /api/v1/links/:id/versions`
Retrieves immutable historical versions and rollbacks for a link.
- **Response (200 OK):** List of `LinkVersion` records ordered by `versionNumber DESC`.

### `POST /api/v1/links/:id/versions/:versionNumber/rollback`
Rolls back destination URL to a previous version number, logging a new explicit version entry.

---

## 3. QR Identity Endpoints

### `GET /api/v1/links/:id/qr`
Generates vector SVG or base64 PNG QR code bound to the canonical short link.
- **Query Parameters:**
  - `format`: `svg` (default) or `png`.
  - `margin`: quiet zone margin (integer, default 2).
  - `size`: pixel width for PNG (default 512).
- **Response:**
  - If `format=svg`: Raw SVG XML or JSON with data URL.
  - If `format=png`: Direct PNG binary download or data URL.

---

## 4. Campaign DNA Endpoints

### `GET /api/v1/campaigns`
Lists all campaigns in the active workspace.

### `POST /api/v1/campaigns`
Creates a campaign with UTM defaults.
- **Request Body:**
  ```json
  {
    "name": "Black Friday 2026",
    "description": "Annual promotion",
    "channel": "Email",
    "utmSource": "newsletter",
    "utmMedium": "email"
  }
  ```

---

## 5. Redirect Engine & Public Resolution

### `GET /r/:code` or `GET /:code`
Public redirect resolution endpoint.
- **Policy Evaluation:**
  - `ACTIVE`: Returns HTTP 302/307 redirect to `destinationUrl`.
  - `PAUSED`: Renders inactive link interstitial.
  - `EXPIRED`: Renders expired link notice.
  - Not found: Returns HTTP 404.
- **Asynchronous Sidecar:** Fires non-blocking redirect event logging.

---

## 6. Analytics & Export Endpoints

### `GET /api/v1/analytics/summary`
Retrieves aggregate timeseries, referrers, device families, and country breakdowns.
- **Query Parameters:**
  - `linkId` (optional)
  - `campaignId` (optional)
  - `range`: `24h`, `7d`, `30d`, `90d`, `all` (default `7d`).

### `GET /api/v1/analytics/export`
Generates a downloadable CSV file of recorded redirect events.

---

## 7. Abuse Reporting Endpoints

### `POST /api/v1/abuse-reports`
Public endpoint (rate-limited) to report deceptive or malicious short links.
- **Request Body:**
  ```json
  {
    "shortCode": "suspect-link",
    "category": "Phishing",
    "description": "Page mimics a bank login.",
    "reporterEmail": "reporter@example.com"
  }
  ```
