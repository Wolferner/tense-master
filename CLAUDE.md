@AGENTS.md

# Project: Tense Master

English tenses practice app. User selects which tenses to practice, gets a sentence in Russian, types English translation, then reveals correct answer with explanation.

## Architecture

Onion architecture. All server-side code lives under `server/`:

- `server/domain/` — entities, value objects, repository interfaces. No external dependencies.
- `server/aplication/` — business logic (services) and DTOs. Depends only on domain.
- `server/infastructure/` — controllers (HTTP handlers) and repository implementations (Prisma). Depends on domain + application.

Client/UI code:

- `presentation/` — React components and pages (at project root, not inside `app/`)
  - `presentation/web/` — web-specific pages and components
  - `presentation/telegram/` — Telegram Mini App pages and components (partially implemented)
  - `presentation/components/` — shared shadcn/ui components
- `app/` — Next.js App Router only. Pages here just import from `presentation/` and export metadata.
- `shared/` — shared utilities, types, constants, hooks used across layers.

Dependencies point inward only. Domain has no knowledge of Prisma or Next.js.

## Folder structure

```
server/
  domain/
    entities/         Exercise.ts, Answer.ts
    value-objects/    Tense.ts (as const + type, no TS enums)
    repositories/     IExerciseRepository.ts
  aplication/
    exercise/         ExerciseService.ts, dto/, __tests__/
  infastructure/
    http/             ExerciseController.ts, container.ts
    prisma-orm/       PrismaExerciseRepository.ts, prismaClient.ts
    seeds/            seed.ts, data/*.json
presentation/
  web/
    pages/            Home/, TenseTrainer/, Profile/, Settings/
    components/       Header/, InstallBanner/, NetworkBadge/
  telegram/           (stubs — pages exist but not fully implemented)
  components/
    ui/               shadcn components (badge, button, checkbox, textarea)
app/
  (web)/              page.tsx, tense-trainer/, profile/, settings.tsx/  ← bug: settings.tsx/ should be settings/
  telegram/           page.tsx, tense-trainer/, profile/, settings.tsx/
  api/
    excersises/       route.ts
    serwist/          route.ts (PWA service worker)
shared/
  api/                fetchExercises.ts
  config/             constants.ts
  hooks/              useInstallPrompt.ts, useNetworkStatus.ts
  lib/                utils.ts, validateAnswer.ts
  pwa/                serwist.ts, sw.ts
prisma/
  schema.prisma
  migrations/
  generated/prisma/   Prisma Client output
```

## Domain entities

- `Exercise` — `id: string`, `question: string`, `answer: string`, `explanation: string`, `tense: Tense`
- `ExerciseAnswer` — union type: `ExerciseAnswerManual` (has `isCorrect`) | `ExerciseAnswerSkipped`. Fields: `answer`, `skipped`, `createdAt`, `sessionId`
- `Tense` — `as const` object + union type. No TS enums anywhere in the project.

## Architecture decisions

- No auth, no user model — all settings and history stored in localStorage
- DB is content-only: exercises + tenses
- Prisma Client output: `prisma/generated/prisma`
- PWA support via serwist (service worker, install prompt, offline badge)

## Data model

Current Prisma schema (`prisma/schema.prisma`):

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
- Vitest + @testing-library/react (tests exist in `__tests__/` folders)
