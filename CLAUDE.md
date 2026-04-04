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
  entities/         Exercise.ts, Answer.ts
  value-objects/    Tense.ts (as const + type, no TS enums)
  repositories/     IExerciseRepository.ts
  services/         AnswerValidator.ts

server/
  application/
    exercise/       ExerciseService.ts, dto/CreateExerciseDto.ts, __tests__/
  infrastructure/
    http/           ExerciseController.ts, container.ts
    prisma-orm/     PrismaExerciseRepository.ts, prismaClient.ts
    seeds/          seed.ts, data/*.json

client/
  application/
    services/       ExerciseSessionService.ts
    repositories/   IExerciseApiRepository.ts
  stores/           sessionStore.ts, settingsStore.ts
  infrastructure/
    api/            ExerciseApiRepository/ExerciseApiRepository.ts, container.ts

presentation/
  web/
    pages/          Home/, TenseTrainer/, Profile/, Settings/
    components/     Header/, InstallBanner/, NetworkBadge/
  telegram/         (not implemented)
  components/
    ui/             shadcn components (badge, button, checkbox, textarea)

app/
  (web)/            page.tsx, tense-trainer/, profile/, settings.tsx/ ← bug: rename to settings/
  telegram/         page.tsx, tense-trainer/, profile/, settings.tsx/
  api/
    exercises/      route.ts
    serwist/        route.ts (PWA service worker)

shared/
  dtos/             ExerciseResponseDto.ts  ← shared API contract between server and client
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
- `Tense` — `as const` object + union type. No TS enums anywhere in the project.

### Repository interfaces

- `IExerciseRepository` — `findRandom`, `create`

### Domain services (pure functions, no IO)

- `AnswerValidator` — validates user answer against correct answer (case-insensitive trim)

## Client layer

### Application services

- `ExerciseSessionService` — loads exercises from API (with fallback to `/fallback-exercises.json`), resolves next exercise, creates typed answers

### Zustand stores

Stores are the glue between UI and application services. UI only calls store methods and reads store state — no direct access to services.

- `sessionStore` — current training session (exercises, answers, sessionId, step, currentExerciseIndex). Persisted to localStorage.
- `settingsStore` — user settings (selectedTenses, mode, fixedLimit). Persisted to localStorage.

## Architecture decisions

- `ExerciseResponseDto` lives in `shared/dtos/` — it's the API contract used by both server and client. `CreateExerciseDto` stays in `server/` — it's server-only.
- Client fetches exercises from `/api/exercises`, falls back to `/fallback-exercises.json` on error.
- Settings and session state stored in localStorage via Zustand `persist` middleware (no Dexie yet).
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
- Zod (validation), Zustand (client state)
- shadcn/ui (radix-ui based components in `presentation/components/ui/`)
- serwist (PWA / service worker)
- Prettier + ESLint + Husky + lint-staged
- Vitest + @testing-library/react (tests in `__tests__/` folders)
