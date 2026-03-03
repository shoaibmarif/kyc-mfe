# kyc-mfe

**Know Your Customer (KYC) micro-frontend** — a Webpack Module Federation remote that handles user sign-up and login flows. Loaded dynamically by `custom-main-shell` at runtime.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Port](#port)
- [Module Federation](#module-federation)
- [Routes](#routes)
- [Project Structure](#project-structure)
- [Observability](#observability)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Running Locally](#running-locally)
- [Building](#building)
- [Deployment (Netlify)](#deployment-netlify)

---

## Overview

`kyc-mfe` is a **remote MFE** responsible for KYC-related flows:

- **Login** — user authentication entry point
- **Sign Up** — new user registration

React, React Router, Tailwind CSS, and Axios are consumed as singletons from the host shell (`custom-main-shell`) — they are not bundled inside this MFE.

---

## Tech Stack

| Category      | Library / Tool                 | Version           |
| ------------- | ------------------------------ | ----------------- |
| UI            | React (shared from host)       | ^18 / ^19         |
| Routing       | React Router DOM (shared)      | ^7.11.0           |
| Styling       | Tailwind CSS                   | ^3.3.5            |
| Forms         | React Hook Form + Zod          | ^7.48.2 / ^3.22.4 |
| HTTP          | Axios (shared from host)       | ^1.13.2           |
| Bundler       | Webpack 5 + Module Federation  | ^5.104.1          |
| Language      | TypeScript                     | ^5.9.3            |
| Observability | via `customMain/observability` | —                 |

---

## Port

| Environment          | Port                                  |
| -------------------- | ------------------------------------- |
| Development          | **5005**                              |
| Staging / Production | Configured via `.env` → `REMOTE_PORT` |

---

## Module Federation

**Name:** `kycMfe`
**Remote entry:** `http://localhost:5005/remoteEntry.js`

### Exposed modules

| Import path            | Source file                  | Description                              |
| ---------------------- | ---------------------------- | ---------------------------------------- |
| `kycMfe/App`           | `src/App.tsx`                | Root MFE component (mounted by shell)    |
| `kycMfe/LoginForm`     | `src/pages/LoginForm.tsx`    | Login form component                     |
| `kycMfe/SignUpForm`    | `src/pages/SignUpForm.tsx`   | Sign-up form component                   |
| `kycMfe/services/auth` | `src/services/auth/index.ts` | Auth service (login, register API calls) |

### Consumed from host shell (`customMain`)

- `customMain/observability` — SkyWalking Tracer + `useMfeRouteTracker`
- `customMain/api` — shared Axios instance
- `customMain/components` — UI component library
- `customMain/hooks` — shared hooks

---

## Routes

| Path       | Component    | Description           |
| ---------- | ------------ | --------------------- |
| `/kyc`     | `LoginForm`  | User login            |
| `/sign-up` | `SignUpForm` | New user registration |
| `*`        | —            | 404 fallback          |

> Routes are prefixed by the shell. The shell mounts this MFE under a base path that includes `/kyc`.

---

## Project Structure

```
src/
├── App.tsx             # Root component — useMfeRouteTracker + lifecycle
├── bootstrap.tsx       # ReactDOM.createRoot (standalone only)
├── index.tsx           # Webpack entry — Tracer.mfeMounting + dynamic import
├── index.css           # MFE-local CSS
├── components/         # KYC-specific components
├── hooks/              # KYC-local hooks
├── observability/
│   └── tracer.ts       # Re-export: { Tracer, useMfeRouteTracker } from customMain/observability
├── pages/
│   ├── LoginForm.tsx   # Login page
│   └── SignUpForm.tsx  # Sign-up page
├── routes/
│   └── appRoutes.ts    # Route constants (SIGNUP, NOT_FOUND)
├── services/
│   └── auth/           # Authentication API service
├── types/
│   └── customMain.d.ts # Type declarations for Module Federation imports
└── utils/
```

---

## Observability

This MFE uses the SkyWalking agent initialized by the host shell. No agent re-registration occurs here.

### How it's wired

```ts
// index.tsx — starts the mount timer before React renders
import { Tracer } from './observability/tracer';
Tracer.mfeMounting('kyc-mfe');
import('./bootstrap');

// App.tsx — records actual mount duration + tracks every route change
useMfeRouteTracker(); // → every /kyc and /sign-up appear in SkyWalking Page tab
Tracer.mfeMounted('kyc-mfe'); // → reported as /#mount:kyc-mfe

// Error boundary / catch blocks
Tracer.reportError('KYCErrorBoundary', error);

// Business events
Tracer.reportCustomEvent('kyc.login.submit');
Tracer.reportCustomEvent('kyc.signup.submit');
```

### SkyWalking Page tab entries this MFE produces

| Page path         | Meaning                          |
| ----------------- | -------------------------------- |
| `/kyc`            | User visited the login page      |
| `/sign-up`        | User visited the sign-up page    |
| `/#mount:kyc-mfe` | MFE mounted — load time recorded |

---

## Environment Variables

```env
# Port override (optional — defaults to 5005)
REMOTE_PORT=5005

# Environment context
REACT_APP_ENV=development
```

---

## Available Scripts

| Script                  | Description                  |
| ----------------------- | ---------------------------- |
| `npm start`             | Lint then start dev server   |
| `npm run dev`           | Start dev server (no lint)   |
| `npm run start:staging` | Start in staging mode        |
| `npm run start:prod`    | Start in production mode     |
| `npm run build`         | Production build             |
| `npm run build:staging` | Staging build                |
| `npm run build:dev`     | Development build            |
| `npm run lint`          | ESLint check (zero warnings) |
| `npm run lint:fix`      | ESLint auto-fix              |

---

## Running Locally

```bash
cd kyc-mfe
npm install
npm run dev
# → http://localhost:5005
# remoteEntry: http://localhost:5005/remoteEntry.js
```

> The shell must also be running for authentication context and shared modules to work. Run `npm run start:all` from `custom-main-shell` to start everything together.

---

## Building

```bash
npm run build          # production
npm run build:staging  # staging
# Output: dist/
```

---

## Deployment (Netlify)

Configured via `netlify.toml`:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **CORS headers:** applied to all routes and `remoteEntry.js`
- `remoteEntry.js` — `Cache-Control: no-cache` for instant updates
- Redirects standalone `/` and `/index.html` back to the main shell (`https://weboc.tech`)
