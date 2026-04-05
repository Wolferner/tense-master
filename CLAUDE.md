@AGENTS.md

# Project: Tense Master

English tenses practice app. User selects which tenses to practice, gets a sentence in Russian, types English translation, then reveals correct answer with explanation.

## Architecture

Based on Onion Architecture (Palermo), adapted for fullstack and local-first.

`domain/` is the shared core — used by both server and client, no external dependencies. Repository interfaces are defined in the `application/` layer of each side (server and client), not in `domain/`, because the server and client have different repository contracts (Prisma vs API client). This follows Clean Architecture's placement of interfaces at the application boundary.

Dependency rule: `presentation → client → domain ← server`

- `domain/` — entities, value objects, domain services. No external dependencies. Shared by both server and client.
- `server/` — server application layer (use cases, repository interfaces for Prisma) + infrastructure (Prisma, HTTP).
- `client/` — client application layer (use cases, repository interfaces for API) + infrastructure (API client) + Zustand stores.
- `presentation/` — React UI only. No business logic. Consumes Zustand stores.
- `app/` — Next.js App Router routing only. Pages import from `presentation/`.
- `shared/` — pure utilities and shared contracts (cn(), constants, hooks, PWA, DTOs).

## Folder structure

```
domain/
  entities/         Exercise.ts, Answer.ts, Session.ts
  value-objects/    Tense.ts (as const + type, no TS enums)
  services/         AnswerValidator.ts, __tests__/

server/
  application/
    exercise/       ExerciseService.ts, __tests__/
    repositories/   IExerciseRepository.ts
  infrastructure/
    http/           ExerciseController.ts, container.ts
    prisma-orm/     PrismaExerciseRepository.ts, prismaClient.ts
    seeds/          seed.ts, data/*.json

client/
  application/
    api/            IExerciseApi.ts
    services/       ExerciseSessionService.ts, ExerciseSyncService.ts, ProfileService.ts, __tests__/
    repositories/   IAnswerRepository.ts, IExerciseRepository.ts, ISessionRepository.ts
  stores/           sessionStore.ts, settingsStore.ts
  infrastructure/
    http/           ExerciseApi.ts
    dexie/          db.ts, DexieAnswerRepository.ts, DexieExerciseRepository.ts, DexieSessionRepository.ts
    container.ts

presentation/
  web/
    pages/          Home/, TenseTrainer/, Profile/, Settings/
    components/     Header/, InstallBanner/, NetworkBadge/, SyncProvider/
  telegram/         (not implemented)
  components/
    ui/             shadcn components (badge, button, checkbox, textarea)

app/
  (web)/            page.tsx, tense-trainer/, profile/, settings.tsx/ ← bug: rename to settings/
  telegram/         page.tsx, tense-trainer/, profile/, settings.tsx/
  api/
    exercises/      route.ts, all/route.ts, meta/route.ts
    serwist/        route.ts (PWA service worker)

shared/
  dtos/             ExerciseResponseDto.ts, CreateExerciseDto.ts
  lib/              utils.ts
  config/           constants.ts, training.ts
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
- `Session` — `id`, `tenses`, `mode`, `fixedLimit`, `status` (`active` | `completed`), `createdAt`, `completedAt?`
- `Tense` — `as const` object + union type. No TS enums anywhere in the project.

### Domain services (pure functions, no IO)

- `AnswerValidator` — validates user answer against correct answer (case-insensitive trim)

## Client layer

### Application services

- `ExerciseSessionService` — loads exercises from Dexie local store (synced from API), resolves next exercise, creates typed answers, persists sessions and answers to Dexie
- `ExerciseSyncService` — syncs exercises from API to Dexie; uses `/api/exercises/meta` to check `lastUpdatedAt` before fetching all via `/api/exercises/all`
- `ProfileService` — reads overall stats (total, correct, skipped, accuracy) from Dexie answer/session repositories

### Zustand stores

Stores are the glue between UI and application services. UI only calls store methods and reads store state — no direct access to services.

- `sessionStore` — current training session (exercises, currentAnswer, sessionId, step, currentExerciseIndex, isLoading). Persisted to localStorage.
- `settingsStore` — user settings (selectedTenses, mode, fixedLimit). Persisted to localStorage.

## Architecture decisions

- `ExerciseResponseDto` and `CreateExerciseDto` both live in `shared/dtos/` — shared API contract between server and client.
- Exercises are stored locally in Dexie (IndexedDB). `ExerciseSyncService` syncs from API using `/api/exercises/meta` + `/api/exercises/all`. Sessions and answers are also persisted in Dexie.
- Zustand `sessionStore` persists only UI-level session state to localStorage (exercises list, step, index, currentAnswer). Dexie holds the authoritative data.
- Prisma Client output: `prisma/generated/prisma`
- PWA support via serwist (service worker, install prompt, offline badge)
- `SyncProvider` component mounts at layout level to trigger `ExerciseSyncService.sync()` on app load
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
- Zod (validation), Zustand (client state)
- Dexie 4.4.2 (IndexedDB — local storage for exercises, sessions, answers)
- shadcn/ui (radix-ui based components in `presentation/components/ui/`)
- serwist (PWA / service worker)
- Prettier + ESLint + Husky + lint-staged
- Vitest + @testing-library/react (tests in `__tests__/` folders)
