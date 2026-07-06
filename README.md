# Midcentury ADU

Standalone marketing site + admin CMS for Midcentury ADU. This project was
extracted from a shared monorepo (which also contained a second brand,
HEMMA) into its own fully independent codebase, API server, and database.

## Stack

- **Client:** React + Vite + Tailwind CSS v4 + wouter (routing) + TanStack Query
- **Server:** Express + Drizzle ORM (Postgres)
- **Storage:** Google Cloud Storage (object storage, presigned uploads)
- **Email:** Resend
- **Bot protection:** Cloudflare Turnstile

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | yes | Postgres connection string for this project's own database |
| `ADMIN_TOKEN` | yes | Bearer token used to protect `/api/admin/*` routes |
| `TURNSTILE_SECRET_KEY` | recommended | Cloudflare Turnstile secret, for spam-checking lead submissions |
| `TURNSTILE_SITE_KEY` | recommended | Cloudflare Turnstile site key (client-side) |
| `RESEND_API_KEY` | recommended | For sending lead notification emails |
| `RESEND_FROM_EMAIL` | recommended | "From" address for outgoing emails |
| `ADMIN_BASE_URL` | recommended | Used to build links in email notifications |
| `PUBLIC_OBJECT_SEARCH_PATHS` | for image uploads | GCS bucket/path(s) served publicly |
| `PRIVATE_OBJECT_DIR` | for image uploads | GCS path used for private/staged uploads |

### 3. Provision a database

Point `DATABASE_URL` at any Postgres database (Replit's built-in Postgres,
Neon, Supabase, RDS, etc). Then push the schema:

```bash
npm run db:push
```

### 4. (Optional) Migrate existing Midcentury ADU data

If you're moving off the old shared monorepo database, run the one-time
migration script. It copies Midcentury-only models, model images, included
products, posts, and availability windows into this project's database.

```bash
SOURCE_DATABASE_URL="<old shared database URL>" \
DATABASE_URL="<this project's database URL>" \
npm run db:seed
```

Note: lead records are **not** migrated automatically (the old `leads` table
had no way to distinguish which site a lead came from). Export/migrate those
by hand if you need the history.

### 5. Run the dev server

```bash
npm run dev
```

This starts the Express API on port 3001 and the Vite dev server (which
proxies `/api/*` to the Express server) on the port specified by the `PORT`
environment variable (defaults to 5000).

### 6. Build for production

```bash
npm run build
npm start
```

`npm start` runs a single Express process that serves both the built client
and the API from the `PORT` environment variable.

## Admin

Visit `/admin` and sign in with the `ADMIN_TOKEN` value to manage floor plan
models, blog posts, leads, and booking availability.

## Project structure

```
client/          React app (Vite root)
server/          Express API server
shared/          Drizzle schema shared by server and migration scripts
scripts/seed.ts  One-time data migration from the old shared database
```
