# Tense Master

An app for practicing English tenses. Select which tenses to train, get a sentence in Russian, type the English translation, then reveal the correct answer with explanation.

Live: [tense-master.vercel.app](https://tense-master.vercel.app)

## Features

- Practice all 12 English tenses individually or in groups
- Local-first: exercises sync once and work offline
- Session history with per-answer breakdown
- Progress chart on the profile page
- PWA — installable on mobile and desktop

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS v4, shadcn/ui
- Zustand (client state), Dexie (IndexedDB)
- Prisma 7 + PostgreSQL (Neon)
- serwist (PWA / service worker)
- Vitest + Testing Library

## Getting Started

```bash
npm install
```

Create a `.env` file with your database URL:

```env
DATABASE_URL=your_neon_postgres_url
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command                | Description           |
| ---------------------- | --------------------- |
| `npm run dev`          | Start dev server      |
| `npm run build`        | Production build      |
| `npm run test`         | Run tests             |
| `npm run lint`         | Run ESLint            |
| `npm run typecheck`    | TypeScript type check |
| `npm run format:write` | Format with Prettier  |

## Architecture

Onion Architecture adapted for fullstack + local-first:

```
domain/       — entities, value objects, domain services (no dependencies)
server/       — use cases, Prisma repositories, HTTP controllers
client/       — use cases, API client, Zustand stores, Dexie repositories
presentation/ — React UI only, consumes Zustand stores
app/          — Next.js App Router routing
shared/       — utilities, DTOs, hooks, PWA
```

See `docs/architecture/design.md` for the full spec.
