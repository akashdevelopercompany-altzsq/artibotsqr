# API Design

## Overview
RESTful API exposed via NestJS backend. Protected endpoints require authorization headers using Bearer JWT.

## Response Format
Standardized response payload:
```json
{
  "success": true,
  "data": { ... },
  "requestId": "req_123"
}
```
Error Format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  },
  "requestId": "req_123"
}
```

## Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register`: Register a new user and default organization.
- `POST /login`: Authenticate and receive JWT + Refresh Token in HttpOnly Cookies.
- `POST /logout`: Invalidate sessions.
- `POST /refresh`: Refresh session token.

### QR Codes (`/api/v1/qr`)
- `POST /`: Create a new dynamic QR code.
- `GET /`: Retrieve paginated list of QR codes for the current organization.
- `GET /:id`: Get specific QR code details.
- `PATCH /:id`: Update QR code properties (e.g., destinationUrl, status).
- `DELETE /:id`: Soft delete or archive a QR code.
- `POST /:id/duplicate`: Clone an existing QR code.
- `POST /:id/activate`: Set status to ACTIVE.
- `POST /:id/deactivate`: Set status to INACTIVE.

### Analytics (`/api/v1/qr/:id/analytics`)
- `GET /summary`: Returns total scans, unique scans.
- `GET /timeseries`: Returns time-series scan data over a date range.
- `GET /geography`: Returns breakdown of scans by country/region.
- `GET /devices`: Returns breakdown of device type, OS, browser.

### Redirect Engine (`/q`)
- `GET /:shortCode`: Highly optimized endpoint. Does not return JSON in typical flows; returns an HTTP 302/301 redirect to the resolved `destinationUrl`.

### Organizations (`/api/v1/organizations`)
- `GET /`: List user's organizations.
- `POST /`: Create an organization.
- `GET /:id/members`: List members.

### API Keys (`/api/v1/api-keys`)
- `GET /`: List active keys.
- `POST /`: Generate a new key.
- `DELETE /:id`: Revoke a key.
