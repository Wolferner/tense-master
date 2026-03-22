@AGENTS.md

# Project: Tense Master

English tenses practice app. User selects which tenses to practice, gets a sentence in Russian, types English translation, then reveals correct answer with explanation.

## Architecture

Onion architecture. All server-side code lives under `server/`:

- `server/domain/` — entities, value objects, repository interfaces (`IExerciseRepository`). No external dependencies.
- `server/aplication/` — business logic (services) and DTOs. Depends only on domain.
- `server/infastructure/` — controllers (HTTP handlers) and repository implementations (Prisma). Depends on domain + application.

Client/UI code:

- `presentation/` — React components and pages (at project root, not inside `app/`)
  - `presentation/web/` — web-specific pages and components
  - `presentation/telegram/` — Telegram Mini App pages and components
  - `presentation/components/` — shared components
- `app/` — Next.js App Router only. Pages here just import from `presentation/` and export metadata.
- `shared/` — shared utilities, types, constants used across layers.

Dependencies point inward only. Domain has no knowledge of Prisma or Next.js.

## Folder structure

```
server/
  domain/
    entities/         Exercise.ts
    value-objects/    Tense.ts (as const + type, no TS enums)
    repositories/     IExerciseRepository.ts
  aplication/
  infastructure/
presentation/
  web/
    pages/            Home/, TenseTrainer/, Profile/, Settings/
  telegram/           (empty — not yet implemented)
  components/
app/
  (web)/              page.tsx, tense-trainer/, profile/, settings.tsx/ ← bug: rename to settings/
  telegram/           (stubs only)
  api/excersises/
shared/
prisma/
```

## Domain decisions

- No value objects for primitive fields — `Exercise` entity uses plain `string` for `question`, `answer`, `explanation`
- `Tense` is `as const` object + union type (no TS enums anywhere in the project)
- `Exercise.id` is plain `string`
- Repository interface uses `Exercise['id']` for id param type

## Architecture decisions

- No auth, no user model — all settings and history stored in localStorage
- DB is content-only: exercises + enum tenses
- Prisma Client output: `prisma/generated/prisma`

## Data model

Current Prisma schema (`prisma/schema.prisma`):

```prisma
model TenseExerciseQuestion {
  id          String   @id @default(uuid())
  question    String
  answer      String
  explanation String
  tense       Tense
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([question, tense])
}

enum Tense {
  PRESENT_SIMPLE | PRESENT_CONTINUOUS | PRESENT_PERFECT | PRESENT_PERFECT_CONTINUOUS
  PAST_SIMPLE | PAST_CONTINUOUS | PAST_PERFECT | PAST_PERFECT_CONTINUOUS
  FUTURE_SIMPLE | FUTURE_CONTINUOUS | FUTURE_PERFECT | FUTURE_PERFECT_CONTINUOUS
}
```

## Stack

- Next.js 16 (breaking changes — read node_modules/next/dist/docs/ before writing code)
- React 19, TypeScript, Tailwind CSS v4
- Prisma 7, PostgreSQL (Neon), migrations in `prisma/migrations/`
- Zod (validation), Zustand (client state)
- shadcn/ui (radix-ui based components in `presentation/components/ui/`)
- Prettier + ESLint + Husky + lint-staged
- No testing setup
