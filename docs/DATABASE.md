# Database Design

## Technology
- **Database Engine**: Supabase (PostgreSQL)
- **ORM / Migrations**: Prisma
- **Storage**: Supabase Storage (`qrcode` bucket)

## ERD Overview
The core entities revolve around Organizations, Users, QR Codes, and Scans.

### Users & Authentication
- **User**: General identity information. Managed partially by Supabase Auth (or Custom Auth depending on requirements, though we build our own JWT as per requirements, we will use a custom `User` table).
  - `id` (String/UUID, PK)
  - `email` (String, Unique)
  - `passwordHash` (String)
  - `name` (String)
  - `role` (Enum: SUPER_ADMIN, ADMIN, USER)
  - `createdAt`, `updatedAt`

### Organizations (Tenants)
- **Organization**: Workspace for users and QR codes.
  - `id` (String/UUID, PK)
  - `name` (String)
  - `slug` (String, Unique)
  - `billingPlan` (Enum: FREE, STARTER, BUSINESS, ENTERPRISE)
  - `createdAt`, `updatedAt`

- **OrganizationMember**: Join table for Users and Organizations.
  - `id` (String/UUID, PK)
  - `userId` (FK to User)
  - `organizationId` (FK to Organization)
  - `role` (Enum: OWNER, ADMIN, MEMBER, VIEWER)

### Core QR Domain
- **QRCode**: The primary entity representing a generated QR.
  - `id` (String/UUID, PK)
  - `userId` (FK to User)
  - `organizationId` (FK to Organization)
  - `name` (String)
  - `type` (Enum: WEBSITE, PRODUCT, PAYMENT, CUSTOM, CAMPAIGN, UPI)
  - `shortCode` (String, Unique, Indexed)
  - `destinationUrl` (String)
  - `status` (Enum: ACTIVE, INACTIVE, EXPIRED, BLOCKED)
  - `expiresAt` (DateTime, Nullable)
  - `createdAt`, `updatedAt`

- **QRDesign**: The visual representation attributes of the QR.
  - `id` (String/UUID, PK)
  - `qrCodeId` (FK to QRCode, Unique)
  - `foregroundColor` (String)
  - `backgroundColor` (String)
  - `logoUrl` (String, Nullable, refers to Supabase `qrcode` bucket)
  - `errorCorrection` (Enum: L, M, Q, H)
  - `margin` (Int)
  - `size` (Int)
  - `frameStyle` (String)
  - `frameText` (String)

### Analytics
- **QRScan**: Tracks individual scan events. High volume table.
  - `id` (String/UUID, PK)
  - `qrCodeId` (FK to QRCode, Indexed)
  - `scannedAt` (DateTime, Indexed)
  - `ipHash` (String)
  - `userAgent` (String)
  - `country`, `region`, `city` (String, Nullable)
  - `deviceType`, `os`, `browser` (String, Nullable)
  - `referrer` (String, Nullable)

### Billing & Extensibility
- **ApiKey**: For business customers interacting via API.
  - `id` (String/UUID, PK)
  - `organizationId` (FK to Organization)
  - `keyHash` (String, Unique)
  - `lastUsedAt` (DateTime, Nullable)
  - `createdAt`, `updatedAt`

- **AuditLog**: For tracking sensitive actions.
  - `id` (String/UUID, PK)
  - `actorId` (String, ID of user/system)
  - `action` (String)
  - `resource` (String)
  - `resourceId` (String)
  - `metadata` (JSON)
  - `timestamp` (DateTime)

## Indexes
- `QRCode.shortCode`: Essential for ultra-low latency redirect lookups.
- `QRScan.qrCodeId`, `QRScan.scannedAt`: Crucial for analytics aggregation (e.g., querying scans over time for a given QR).
- `User.email`
- `Organization.slug`
