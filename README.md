# CommercialNews Web

Frontend monorepo for the CommercialNews platform.

This repository contains the frontend applications for CommercialNews:

- `apps/admin`: internal admin dashboard
- `apps/website`: public reader-facing website
- `packages`: shared packages, planned for future reuse

## Repository Structure

```text
commercialnews-web/
├── apps/
│   ├── admin/      # React + TypeScript + Vite admin dashboard
│   └── website/    # Next.js public website
├── packages/       # Shared packages, planned
├── package.json    # Root npm workspace scripts
├── package-lock.json
└── README.md
```

## Apps

### Admin

Location:

```text
apps/admin
```

Stack:

- React
- TypeScript
- Vite

Default local URL:

```text
http://localhost:5173
```

### Website

Location:

```text
apps/website
```

Stack:

- Next.js
- TypeScript

Default local URL:

```text
http://localhost:3000
```

## Requirements

Use Node.js 22 LTS or newer.

Check versions:

```bash
node -v
npm -v
```

## Installation

Install dependencies from the repository root:

```bash
npm install
```

## Development

Run the admin app:

```bash
npm run dev:admin
```

Run the website app:

```bash
npm run dev:website
```

## Build

Build the admin app:

```bash
npm run build:admin
```

Build the website app:

```bash
npm run build:website
```

Build all apps:

```bash
npm run build
```

## Lint

Lint the admin app:

```bash
npm run lint:admin
```

Lint the website app:

```bash
npm run lint:website
```

Lint all apps:

```bash
npm run lint
```

## Environment Variables

Environment files are app-specific.

Admin app:

```text
apps/admin/.env.local
apps/admin/.env.production
apps/admin/.env.example
```

Website app:

```text
apps/website/.env.local
apps/website/.env.production
apps/website/.env.example
```

Vite exposes browser variables with the `VITE_` prefix.

```env
VITE_APP_NAME=CommercialNews Admin
VITE_API_BASE_URL=http://localhost:5226
```

Next.js exposes browser variables with the `NEXT_PUBLIC_` prefix.

```env
NEXT_PUBLIC_APP_NAME=CommercialNews
NEXT_PUBLIC_API_BASE_URL=http://localhost:5226
```

## API Base URLs

Common backend API URLs:

```text
Local dotnet run:
http://localhost:5226

Local Docker + Nginx:
http://localhost:8088

Production:
https://api.minhquy.dev
```

Recommended local default:

```text
http://localhost:5226
```

Use this when running the backend directly with `dotnet run`.

Use this when testing the backend through local Docker/Nginx:

```text
http://localhost:8088
```

Use this for production builds:

```text
https://api.minhquy.dev
```

## Environment File Policy

Do not commit local machine-specific environment files:

```text
.env.local
.env.development.local
.env.production.local
.env.test.local
```

Commit safe example files:

```text
.env.example
```

Never store secrets in frontend environment variables.

Variables prefixed with `VITE_` or `NEXT_PUBLIC_` are exposed to the browser after build.

## Workspace Scripts

This repository uses npm workspaces.

Admin workspace:

```text
@commercialnews/admin
```

Website workspace:

```text
@commercialnews/website
```

Root scripts call app-level scripts through npm workspaces.

Example:

```bash
npm run dev:admin
npm run dev:website
npm run build
npm run lint
```

## Current Status

The current frontend foundation includes:

- React + Vite admin app
- Next.js website app
- npm workspace setup
- root scripts for app-level development and builds
- environment file convention
- shared `packages/` directory planned for future reuse

Feature folders are intentionally not created yet. Each app will introduce feature-based structure when the related module is implemented.