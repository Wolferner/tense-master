@AGENTS.md

# Project: Tense Master

English tenses practice app. User selects which tenses to practice, gets a sentence in Russian, types English translation, then reveals correct answer with explanation.

## Architecture

Ports and Adapters (Hexagonal) architecture. `domain/` is the core — no external dependencies. Server and client are separate sets of adapters over the same domain.

Dependency rule: `presentation → client → domain ← server`

- `domain/` — entities, value objects, repository interfaces, domain services. No external dependencies. Shared by server and client.
- `server/` — server-side adapters: application services (use cases), Prisma repository implementations, HTTP controllers.
- `client/` — client-side adapters: application services, Dexie repository implementations, Zustand stores.
- `presentation/` — React UI only. No business logic. Consumes Zustand stores.
- `app/` — Next.js App Router routing only. Pages import from `presentation/`.
- `shared/` — pure utilities with no business meaning (cn(), constants, hooks, PWA).

## Folder structure

```
domain/
  entities/         Exercise.ts, Answer.ts
  value-objects/    Tense.ts (as const + type, no TS enums)
  repositories/     IExerciseRepository.ts, IProgressRepository.ts, ISettingsRepository.ts
  services/         AnswerValidator.ts, ExerciseSelector.ts, ProgressCalculator.ts

server/
  application/
    exercise/       ExerciseService.ts, dto/, __tests__/
  infrastructure/
    http/           ExerciseController.ts, container.ts
    prisma-orm/     PrismaExerciseRepository.ts, prismaClient.ts
    seeds/          seed.ts, data/*.json

client/
  application/      ExerciseSessionService.ts, ProgressService.ts, SettingsService.ts, SyncService.ts
  stores/           sessionStore.ts, progressStore.ts, settingsStore.ts
  infrastructure/
    dexie/          schema.ts, client.ts, DexieExerciseRepository.ts, DexieProgressRepository.ts, DexieSettingsRepository.ts
    api/            ExerciseApiClient.ts

presentation/
  web/
    pages/          Home/, TenseTrainer/, Profile/, Settings/
    components/     Header/, InstallBanner/, NetworkBadge/
  telegram/         (partially implemented)
  components/
    ui/             shadcn components (badge, button, checkbox, textarea)

app/
  (web)/            page.tsx, tense-trainer/, profile/, settings.tsx/ ← bug: rename to settings/
  telegram/         page.tsx, tense-trainer/, profile/, settings.tsx/
  api/
    exercises/      route.ts
    serwist/        route.ts (PWA service worker)

shared/
  lib/              utils.ts
  config/           constants.ts
  hooks/            useInstallPrompt.ts, useNetworkStatus.ts
  pwa/              serwist.ts, sw.ts

prisma/
  schema.prisma
  migrations/
  generated/prisma/   Prisma Client output
```

## Domain

### Entities

- `Exercise` — `id: string`, `question`, `answer`, `explanation`, `tense: Tense`
- `ExerciseAnswer` — union: `ExerciseAnswerManual` (has `isCorrect`) | `ExerciseAnswerSkipped`. Fields: `answer`, `skipped`, `createdAt`, `sessionId`
- `Tense` — `as const` object + union type. No TS enums anywhere in the project.

### Repository interfaces

- `IExerciseRepository` — `findByTenses`, `findById`
- `IProgressRepository` — `save`, `findByExerciseId`, `findAll`, `clear`
- `ISettingsRepository` — `get`, `save`

### Domain services (pure functions, no IO)

- `AnswerValidator` — validates user answer against correct answer
- `ExerciseSelector` — `selectRandom` / `selectWeighted` (weighted = more errors → shown more often)
- `ProgressCalculator` — `calcExerciseStats`, `calcTenseStats`, `calcSessionStats`

## Client layer

### Dexie (IndexedDB) — local-first storage

Tables: `exercises` (cached from server), `progress` (answer history), `settings` (user settings + anonymousId), `syncMeta` (sync timestamps for future sync).

`syncedAt: null` on progress/settings records = not yet synced to server.

### Application services

- `ExerciseSessionService` — loads exercises (Dexie first, API fallback), picks next exercise, submits/skips answers
- `ProgressService` — reads history, computes stats via ProgressCalculator
- `SettingsService` — reads/writes settings with default initialization
- `SyncService` — stub, implements pull/push when sync is added

### Zustand stores

Stores are the glue between UI and application services. UI only calls store methods and reads store state — no direct access to services or Dexie.

- `sessionStore` — current training session (exercises, currentExercise, answers, sessionId)
- `progressStore` — stats (exerciseStats, tenseStats, recentSessions)
- `settingsStore` — user settings

## Architecture decisions

- Local-first: Dexie is the primary store for the client. Server is used for initial exercise load and future sync.
- No auth yet — anonymousId (uuid) generated on first run, stored in Dexie settings table. Auth + sync planned as future extension.
- Settings and progress stored in Dexie, not localStorage.
- Prisma Client output: `prisma/generated/prisma`
- PWA support via serwist (service worker, install prompt, offline badge)
- Full architecture spec: `docs/architecture/design.md`

## Data model

```prisma
model TenseExerciseQuestion {
  id          String   @id @default(uuid())
  question    String
  answer      String
  tense       Tense
  explanation String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([question, tense])
  @@map("tense_exercise_questions")
}

enum Tense {
  PRESENT_SIMPLE
  PRESENT_CONTINUOUS
  PRESENT_PERFECT
  PRESENT_PERFECT_CONTINUOUS
  PAST_SIMPLE
  PAST_CONTINUOUS
  PAST_PERFECT
  PAST_PERFECT_CONTINUOUS
  FUTURE_SIMPLE
  FUTURE_CONTINUOUS
  FUTURE_PERFECT
  FUTURE_PERFECT_CONTINUOUS
}
```

## Stack

- Next.js 16.2.1 (breaking changes — read node_modules/next/dist/docs/ before writing code)
- React 19.2.4, TypeScript, Tailwind CSS v4
- Prisma 7.5, PostgreSQL (Neon), `@prisma/adapter-neon`
- Dexie (IndexedDB wrapper for local-first storage)
- Zod (validation), Zustand (client state)
- shadcn/ui (radix-ui based components in `presentation/components/ui/`)
- serwist (PWA / service worker)
- Prettier + ESLint + Husky + lint-staged
- Vitest + @testing-library/react (tests in `__tests__/` folders)
