# Exercise Internationalization Design

**Date:** 2026-04-10
**Branch:** feature/internalization

## Overview

Add multi-locale support for exercise content (`question` and `explanation` fields). The `answer` field always stays in English and is not translated. Translated data will be generated and added later — the architecture must support incremental addition of locales.

## Constraints

- All locales will have data simultaneously when released — no fallback logic needed
- API is locale-aware; client re-syncs when locale changes
- `ExerciseResponseDto` shape does not change (remains flat: `question`, `explanation`, etc.)

---

## 1. Database Schema

Remove `question` and `explanation` from `TenseExerciseQuestion`. Add a `Locale` enum and a `TenseExerciseTranslation` table.

```prisma
enum Locale {
  ru
  fr
  de
  es
}

model TenseExerciseQuestion {
  id           String   @id @default(uuid())
  answer       String
  tense        Tense
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  translations TenseExerciseTranslation[]

  @@unique([answer, tense])
  @@map("tense_exercise_questions")
}

model TenseExerciseTranslation {
  id          String   @id @default(uuid())
  exerciseId  String
  locale      Locale
  question    String
  explanation String
  updatedAt   DateTime @updatedAt
  exercise    TenseExerciseQuestion @relation(fields: [exerciseId], references: [id], onDelete: Cascade)

  @@unique([exerciseId, locale])
  @@map("tense_exercise_translations")
}
```

The unique anchor for exercises changes from `[question, tense]` to `[answer, tense]` — `answer` is stable and locale-independent.

---

## 2. Seed Data Format

**JSON files are out of scope for this iteration** — they will be restructured in a separate task.

`seed.ts` is updated to support the new format:

```json
{
	"tense": "PRESENT_SIMPLE",
	"exercises": [
		{
			"answer": "He drinks coffee every morning.",
			"translations": {
				"ru": {
					"question": "Он каждое утро пьёт кофе.",
					"explanation": "Present Simple используется для регулярных действий..."
				}
			}
		}
	]
}
```

`seed.ts` upserts each exercise by `[answer, tense]`, then upserts each translation by `[exerciseId, locale]`.

Until the JSON files are migrated to the new format, the seed script will not run successfully. That is acceptable — the JSON migration task is a prerequisite for running seed.

---

## 3. Server Layer

**`ExerciseService`** gains a `findAll(locale: Locale)` method that queries exercises joined with translations filtered by locale.

**`ExerciseController`** reads `?locale=` from the request (validated against the `Locale` enum). Passed to `findAll`.

**`/api/exercises/meta`** also accepts `?locale=` and returns `lastUpdatedAt` as `MAX(TenseExerciseTranslation.updatedAt)` for the given locale.

`ExerciseResponseDto` is unchanged — server maps the joined result back to the flat shape `{ id, tense, question, answer, explanation, createdAt, updatedAt }` where `updatedAt` comes from `TenseExerciseTranslation.updatedAt`.

---

## 4. Client Layer

**`IExerciseApi` / `ExerciseApi`**: `getAll(locale: string)` and `getMeta(locale: string)` pass locale as query param.

**`ExerciseSyncService.sync(locale: string)`**: sync key becomes `tense-last-synced-${locale}`. Each locale has its own sync timestamp in localStorage. Dexie stores only the current locale's exercises (overwritten on locale change).

**`SyncProvider`**: gets locale via `useLocale()` from `next-intl`. Re-runs sync when locale changes:

```ts
const locale = useLocale();
useEffect(() => {
	syncService.sync(locale);
}, [locale]);
```

---

## 5. Domain Layer

`Locale` is a core business entity — it determines which exercises a user sees and is recorded on every answer. It belongs in `domain/value-objects/Locale.ts` alongside `Tense`, as `as const` + union type.

```ts
export const Locale = {
	ru: 'ru',
	fr: 'fr',
	de: 'de',
	es: 'es',
} as const;

export type Locale = (typeof Locale)[keyof typeof Locale];
```

`ExerciseAnswer` gains a `locale: Locale` field:

```ts
export class ExerciseAnswer {
	constructor(
		readonly id: string,
		readonly sessionId: string,
		readonly exerciseId: string,
		readonly userAnswer: string,
		readonly skipped: boolean,
		readonly isCorrect: boolean | null,
		readonly locale: Locale,
		readonly createdAt: string,
	) {}
}
```

`shared/i18n/config.ts` imports `Locale` from domain and uses it for the routing config instead of duplicating the list. Prisma `Locale` enum is kept in sync manually.

---

## 6. Shared Layer

No changes to `ExerciseResponseDto`.

---

## Affected Files

| File                                                           | Change                                                                              |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `prisma/schema.prisma`                                         | Add `Locale` enum, `TenseExerciseTranslation` model, update `TenseExerciseQuestion` |
| `prisma/migrations/`                                           | New migration                                                                       |
| `server/infrastructure/seeds/data/*.json`                      | Unchanged (out of scope, separate task)                                             |
| `server/infrastructure/seeds/seed.ts`                          | Updated to new format with `translations` object                                    |
| `server/application/exercise/ExerciseService.ts`               | `findAll(locale)`, `getLastUpdatedAt(locale)`                                       |
| `server/infrastructure/prisma-orm/PrismaExerciseRepository.ts` | Updated queries with JOIN                                                           |
| `server/infrastructure/http/ExerciseController.ts`             | Parse `?locale=` param                                                              |
| `app/api/exercises/all/route.ts`                               | Pass locale to controller                                                           |
| `app/api/exercises/meta/route.ts`                              | Pass locale to controller                                                           |
| `client/application/api/IExerciseApi.ts`                       | Add `locale` param to methods                                                       |
| `client/infrastructure/http/ExerciseApi.ts`                    | Pass `locale` in query params                                                       |
| `client/application/services/ExerciseSyncService.ts`           | Accept `locale`, locale-aware sync key                                              |
| `client/application/services/ExerciseSessionService.ts`        | Pass `locale` when creating `ExerciseAnswer`                                        |
| `client/infrastructure/dexie/db.ts`                            | Bump Dexie version, add `locale` to answers store                                   |
| `presentation/web/components/SyncProvider/SyncProvider.tsx`    | Pass `useLocale()` to sync                                                          |
| `domain/value-objects/Locale.ts`                               | New file: `Locale` as const + union type                                            |
| `domain/entities/Answer.ts`                                    | Add `locale: Locale` field                                                          |
| `shared/i18n/config.ts`                                        | Import `Locale` from domain                                                         |
