@AGENTS.md

# Project: Tense Master

English tenses practice app. User selects which tenses to practice, gets a sentence in Russian, types English translation, then reveals correct answer with explanation.

## Architecture

Server-side follows **onion architecture** with these layers:
- `domain/` — entities, interfaces, no dependencies
- `application/` — use cases, depends only on domain
- `infrastructure/` — Prisma, DB, external services
- `presentation/` — React components, pages, client-side logic

Dependencies point inward only. Domain has no knowledge of Prisma or Next.js.

## Architecture decisions

- No auth, no user model — all settings and history stored in localStorage
- DB is content-only: exercises + enum tenses
- Prisma Client output: `app/generated/prisma`

## Data model

```prisma
enum Tense {
  PRESENT_SIMPLE | PRESENT_CONTINUOUS | PRESENT_PERFECT | PRESENT_PERFECT_CONTINUOUS
  PAST_SIMPLE | PAST_CONTINUOUS | PAST_PERFECT | PAST_PERFECT_CONTINUOUS
  FUTURE_SIMPLE | FUTURE_CONTINUOUS | FUTURE_PERFECT | FUTURE_PERFECT_CONTINUOUS
}

model TenseExerciseQuestion {
  id          String   @id @default(uuid())
  sourceText  String   // Russian sentence
  targetText  String   // correct English translation
  explanation String   // why this tense is used
  tense       Tense
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Stack

- Next.js 16 (breaking changes — read node_modules/next/dist/docs/ before writing code)
- React 19, TypeScript, Tailwind CSS v4
- Prisma (not yet installed — needs `npm install prisma @prisma/client`)
- PostgreSQL
- No testing setup
