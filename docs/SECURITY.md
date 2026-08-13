# Security Model

## Overview
The platform handles sensitive user data, access to potentially impactful redirect endpoints, and payment/analytics flows. Security is considered at every layer from the network down to the database.

## Authentication & Authorization
- **Authentication**: JWT-based session tokens issued on successful login/registration. These tokens are stored securely in `HttpOnly`, `Secure`, `SameSite=Strict` cookies to mitigate XSS and CSRF risks.
- **Authorization (RBAC)**: Enforced via guards in the NestJS application. 
  - Roles: `SUPER_ADMIN`, `ADMIN`, `USER`
  - Organization Roles: `OWNER`, `ADMIN`, `MEMBER`, `VIEWER`
- **IDOR/BOLA Prevention**: All resource requests validate the resource's `userId` or `organizationId` against the authenticated token context. UUIDs are used for all IDs to prevent sequence guessing.

## Data Security
- **Passwords**: Never stored in plaintext. Hashed using `Argon2id` which provides strong resistance against GPU cracking.
- **API Keys**: Stored as one-way hashes in the database. Users only see the full API key once upon generation.
- **Data in Transit**: Enforced TLS 1.2+ (HTTPS) across all public endpoints.
- **Sensitive Data**: Avoid storing raw IP addresses if possible; store a salted hash of the IP to ensure GDPR compliance while retaining the ability to analyze unique visitors.

## Redirect Security (Abuse Prevention)
- **URL Validation**: Strict validation against a denylist of malicious schemes (`javascript:`, `file:`, `data:`). Only `http:` and `https:` are permitted, alongside explicit payment schemas (e.g., `upi:`).
- **SSRF Prevention**: Block destination URLs pointing to `localhost`, `127.0.0.1`, internal network blocks (`10.0.0.0/8`, `192.168.0.0/16`), and AWS metadata endpoints.
- **Malicious Content Detection**: Infrastructure hook for automated and manual blocking of abusive destination URLs. Admins can block specific short codes.

## Network & Application Security (OWASP)
- **Rate Limiting**: Applied via Redis across endpoints. Stricter limits applied to:
  - Authentication (Brute Force prevention)
  - QR Creation/Mutation (Spam prevention)
  - API endpoints (Quota enforcement)
- **Security Headers**: HSTS, Content Security Policy (CSP), X-Content-Type-Options, X-Frame-Options set at the reverse proxy (NGINX) and NextJS/NestJS layers.
- **File Uploads**: Logo uploads are strictly validated by MIME type and extension, restricted in size, and stored in an isolated object storage bucket (Supabase Storage) rather than local filesystem or DB.

## Audit & Observability
- **Audit Logs**: All sensitive actions (login, key creation, URL change, admin actions) are logged with `actorId`, `action`, `resourceId`, and `timestamp`.
- **Health Checks**: Liveness and readiness probes to ensure system stability. Log scrubbing to ensure no secrets or PII are logged.
