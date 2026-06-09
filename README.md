# 📰 CommercialNews Web

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![npm workspaces](https://img.shields.io/badge/npm-workspaces-CB3837?logo=npm&logoColor=white)](https://docs.npmjs.com/cli/using-npm/workspaces)

Frontend monorepo for the **CommercialNews** platform.

It contains the public reader-facing website and the internal administration
dashboard. Both applications share the same workspace, scripts, and environment
conventions while keeping their feature code independent.

## ✨ Applications

| Application | Workspace | Technology | Local URL |
| --- | --- | --- | --- |
| Public website | `@commercialnews/website` | Next.js + React | `http://localhost:3000` |
| Admin dashboard | `@commercialnews/admin` | Vite + React | `http://localhost:5173` |

## 🧰 Technology

### Website

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- TanStack Query for server state
- React Hook Form and Zod for forms and validation
- Axios for API communication
- SweetAlert2 for action feedback

### Admin

- React 19 and TypeScript
- Vite
- Ant Design
- TanStack Query
- Zustand
- React Hook Form and Zod

## 🗂 Repository Structure

```text
commercialnews-web/
├── apps/
│   ├── admin/                  # Internal administration dashboard
│   └── website/                # Public CommercialNews website
├── packages/                   # Future shared workspace packages
├── package.json                # Root workspace scripts
├── package-lock.json
└── README.md
```

The website follows a feature-oriented structure:

```text
apps/website/src/
├── app/
│   ├── (public)/               # Pages rendered with PublicHeader/PublicFooter
│   ├── (auth)/                 # Authentication pages without public chrome
│   ├── layout.tsx              # Global fonts, metadata, CSS, and providers
│   └── providers.tsx           # Application-level client providers
├── features/
│   ├── auth/
│   │   ├── api/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   └── types/
│   └── reading/
│       ├── components/
│       ├── types/
│       └── utils/
└── shared/
    ├── api/
    ├── auth/
    ├── components/
    │   ├── content/
    │   ├── layout/
    │   └── ui/
    └── hooks/
```

Route group names such as `(public)` and `(auth)` organize layouts without
appearing in the browser URL.

## 🌐 Website Routes

### Public

| Route | Description |
| --- | --- |
| `/` | Homepage |
| `/about` | About CommercialNews |
| `/editorial-policy` | Editorial standards |
| `/contact` | Contact information |
| `/privacy` | Privacy policy |
| `/terms` | Terms of use |
| `/profile` | Authenticated user profile |

### Authentication

| Route | Description |
| --- | --- |
| `/login` | Sign in |
| `/register` | Create an account |
| `/forgot-password` | Request a password reset link |
| `/reset-password` | Set a new password from a token |
| `/verify-email` | Verify an email address |

The public route group uses `PublicShell`, which supplies the header, footer,
responsive navigation, search, and authenticated user menu. Authentication
pages intentionally use a separate layout without the public header or footer.

## 🔐 Authentication Features

The website currently includes:

- Registration and email verification
- Login, logout, and session refresh
- Resend verification email
- Forgot-password and reset-password flows
- Protected profile page
- Profile and avatar updates
- Password changes
- Login history
- Logout from all sessions
- Shared password fields with show/hide controls
- Zod validation and API error handling

The Axios client sends credentials to the API, attaches the current access
token, and attempts session refresh after eligible `401` responses.

## 🚀 Getting Started

### Requirements

- Node.js 22 LTS or newer
- npm
- CommercialNews API running locally or through Docker

Check installed versions:

```bash
node -v
npm -v
```

### Install

From the repository root:

```bash
npm install
```

### Configure Environment

Copy the example file for the application you want to run:

```bash
cp apps/website/.env.example apps/website/.env.local
cp apps/admin/.env.example apps/admin/.env.local
```

Website variables:

```env
NEXT_PUBLIC_APP_NAME=CommercialNews
NEXT_PUBLIC_API_BASE_URL=http://localhost:5226
```

Admin variables:

```env
VITE_APP_NAME=CommercialNews Admin
VITE_API_BASE_URL=http://localhost:5226
```

Common API URLs:

| Environment | API URL |
| --- | --- |
| Local `dotnet run` | `http://localhost:5226` |
| Local Docker/Nginx | `http://localhost:8088` |
| Production | `https://api.minhquy.dev` |

> Variables prefixed with `NEXT_PUBLIC_` or `VITE_` are exposed to browser
> code. Never put secrets in frontend environment files.

## 💻 Development

Run the public website:

```bash
npm run dev:website
```

Run the admin dashboard:

```bash
npm run dev:admin
```

## ✅ Quality Checks

Build an individual application:

```bash
npm run build:website
npm run build:admin
```

Build the complete workspace:

```bash
npm run build
```

Lint an individual application:

```bash
npm run lint:website
npm run lint:admin
```

Lint the complete workspace:

```bash
npm run lint
```

## 📜 Available Root Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev:website` | Start the Next.js development server |
| `npm run dev:admin` | Start the Vite development server |
| `npm run build:website` | Build the public website |
| `npm run build:admin` | Build the admin dashboard |
| `npm run build` | Build both applications |
| `npm run lint:website` | Lint the public website |
| `npm run lint:admin` | Lint the admin dashboard |
| `npm run lint` | Lint both applications |
| `npm run start:website` | Start the production website build |
| `npm run preview:admin` | Preview the admin production build |

## 🧭 Development Guidelines

- Keep page files focused on routing and composition.
- Put domain behavior inside the matching `features/*` folder.
- Keep reusable layout, UI, API, and utility code inside `shared/*`.
- Add a context or provider only when state genuinely needs to cross feature or
  route boundaries.
- Keep `.env.local` and other machine-specific environment files out of Git.
- Run lint and build checks before committing.
