# System Architecture

## Overview
The Dynamic QR Code Management SaaS Platform is built using a modern, scalable, and decoupled architecture. It provides a robust backend to handle high-velocity QR scans and a responsive frontend for managing campaigns and QR codes.

## High-Level Architecture
The system consists of three main boundaries:
1.  **Frontend Application (Next.js)**: Dashboard, QR code designer, analytics visualization, and user management.
2.  **Backend Core API (NestJS)**: Business logic, authentication, QR generation, organization management.
3.  **Redirect Engine (NestJS + Redis)**: High-performance service that resolves short codes and redirects end users.

### Data Layer
- **Relational Database**: Supabase (PostgreSQL) is the primary source of truth, managed via Prisma ORM.
- **Caching Layer**: Redis caches QR metadata and resolves short codes in memory for blazing-fast redirects.
- **Storage**: Supabase Storage is utilized for hosting uploaded images, such as custom logos embedded in the QR codes.

## Monorepo Strategy
The project is structured as a Turborepo to enforce clean boundaries between shared configurations and micro-apps.
- `apps/web`: Next.js frontend.
- `apps/api`: NestJS backend and redirect engine.
- `packages/database`: Shared Prisma schemas.
- `packages/ui`: Shared React components.
- `packages/config`: ESLint and TypeScript base configurations.

## The Redirect Flow
To ensure the redirect system does not fail under load, it employs a distinct flow optimized for latency:
1. User scans QR code: `https://qr.example.com/q/A8K92X`
2. Request hits the Redirect Engine (`apps/api`).
3. The engine performs an O(1) lookup against Redis.
4. If a cache miss occurs, it falls back to PostgreSQL, populates the Redis cache, and evaluates rules (expiration, status).
5. The redirect payload is evaluated for malicious patterns.
6. A scan event is dispatched to a background queue to be processed asynchronously (ensuring the redirect itself isn't blocked by slow INSERT operations).
7. Client is redirected via HTTP 302/301.

## Security Controls
- **Authentication**: JWT-based session tokens secured as HttpOnly cookies to prevent XSS. 
- **Authorization**: Role-Based Access Control (RBAC). No direct exposure of database identifiers; resources are fetched via UUIDs or short codes.
- **Network**: Deployed behind an NGINX reverse proxy with proper rate-limiting and TLS (HTTPS).

## Deployment Architecture
A Docker-compose architecture groups the services:
- `api_service`: NestJS container.
- `web_service`: Next.js container.
- `redis`: In-memory datastore.
- NGINX serves as the ingress load balancer routing traffic to respective internal ports.
