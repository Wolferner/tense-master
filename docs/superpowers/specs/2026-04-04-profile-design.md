# Profile Feature Design

**Date:** 2026-04-04  
**Status:** Approved  
**Scope:** Answer history, session history, statistics. Local-first (Dexie), auth added separately later.

---

## Overview

The Profile page shows the user their training history and statistics: overall accuracy, per-tense breakdown, list of past sessions, and detailed answer history per session.

Data is stored locally in Dexie (IndexedDB). On first launch all exercises are fetched from the server and cached locally. On subsequent launches the client checks if the server has new exercises and syncs only if needed. Training exercises are served from the local cache — no waiting for the server.

Auth and server-side persistence are out of scope for this iteration.

---

## Domain

### Revised `ExerciseAnswer` (`domain/entities/Answer.ts`)

Current type is rewritten. Exercise context (question, tense, correct answer) is NOT denormalized into the answer — it is available via relation to `Exercise`. `skipped` and `isCorrect` are flat fields suitable for a DB schema.

```typescript
export type ExerciseAnswer = {
	id: string;
	sessionId: string;
	exerciseId: string;
	userAnswer: string;
	skipped: boolean;
	isCorrect: boolean | null; // null when skipped
	createdAt: string;
};
```

### New `Session` entity (`domain/entities/Session.ts`)

```typescript
export type Session = {
	id: string;
	tenses: TenseType[];
	mode: TrainingMode;
	fixedLimit: FixedLimit;
	status: 'active' | 'completed';
	createdAt: string;
	completedAt?: string;
};
```

---

## Client Application Layer

### Repository interfaces (`client/application/repositories/`)

All client-side repository interfaces live in the same folder:

- `IExerciseApiRepository` — existing, used only for sync (not training)
- `IExerciseLocalRepository` — `findRandom(tenses, limit)`, `findById(id)`, `upsertMany(exercises)`
- `ISessionRepository` — `create(session)`, `updateStatus(id, status, completedAt?)`, `findAll()`, `findById(id)`
- `IAnswerRepository` — `create(answer)`, `findBySessionId(sessionId)`, `findAll()`

### Services (`client/application/services/`)

**`ExerciseSyncService`** — called once on app start from `app/(web)/layout.tsx` (and `app/telegram/layout.tsx`):

1. `GET /api/exercises/meta` → `{ lastUpdatedAt: string }`
2. Compare with `lastSyncedAt` stored in localStorage
3. If different: `GET /api/exercises/all` → `upsertMany` into Dexie → update `lastSyncedAt`

New endpoint `GET /api/exercises/all` returns all exercises without filters (separate from the existing filtered endpoint).

**`ExerciseSessionService`** — both `loadExercises` and `resolveNext` (infinite mode fetchMore) switch from `IExerciseApiRepository` to `IExerciseLocalRepository.findRandom`. Constructor receives `IExerciseLocalRepository` instead of `IExerciseApiRepository`.

**`ProfileService`** — pure function, no IO. Accepts arrays of answers and sessions, returns aggregated stats:

- Total answered, correct count, skipped count, accuracy %
- Per-tense breakdown: accuracy % per `TenseType`
- Session summaries: answer count, correct count per session

---

## Infrastructure — Dexie

New folder: `client/infrastructure/dexie/`

```
dexie/
  db.ts
  DexieExerciseRepository.ts
  DexieSessionRepository.ts
  DexieAnswerRepository.ts
  container.ts
```

### Schema (`db.ts`)

```typescript
class TenseMasterDb extends Dexie {
	exercises!: Table<ExerciseResponseDto>;
	sessions!: Table<Session>;
	answers!: Table<ExerciseAnswer>;

	constructor() {
		super('tense-master');
		this.version(1).stores({
			exercises: 'id, tense, updatedAt',
			sessions: 'id, status, createdAt',
			answers: 'id, sessionId, exerciseId, createdAt',
		});
	}
}
```

`lastSyncedAt` is stored in `localStorage` (key: `tense-last-synced`), not in a separate Dexie table.

---

## Server

New endpoint: `GET /api/exercises/meta` → `{ lastUpdatedAt: string }`

Implementation: `ExerciseService.getLastUpdatedAt()` → `SELECT MAX(updatedAt)` via Prisma. Wired in `ExerciseController`.

---

## Store changes (`client/stores/sessionStore.ts`)

- Keep `persist` middleware — active session survives page reload
- Remove `answers` from state and from `partialize` (answers are written to Dexie on each submit)
- `startTraining` — creates a `Session` record in Dexie with `status: 'active'`
- `submitAnswer` — becomes async, writes `ExerciseAnswer` to Dexie via `IAnswerRepository`
- `nextExercise` — on `complete`, calls `ISessionRepository.updateStatus(id, 'completed', completedAt)`

Persisted state: `exercises[]`, `sessionId`, `step`, `currentExerciseIndex`. On restore the user continues from where they left off; answers already submitted are in Dexie.

---

## Profile UI

```
presentation/web/pages/Profile/
  Profile.tsx
  ui/
    StatsOverview/       — total attempts, correct %, skipped %
    TenseBreakdown/      — accuracy per TenseType
    SessionHistory/      — list of sessions (date, tenses, result summary)
      SessionDetail/     — expandable: individual answers with exercise context
```

Data is fetched via a `useProfileData` hook that reads from Dexie repositories directly. No separate profileStore — this is read-only data with no complex mutations.

Stats computation is delegated to `ProfileService` (pure, testable).

---

## File change summary

| Action  | Path                                                              |
| ------- | ----------------------------------------------------------------- |
| Rewrite | `domain/entities/Answer.ts`                                       |
| New     | `domain/entities/Session.ts`                                      |
| New     | `client/application/repositories/IExerciseLocalRepository.ts`     |
| New     | `client/application/repositories/ISessionRepository.ts`           |
| New     | `client/application/repositories/IAnswerRepository.ts`            |
| New     | `client/application/services/ExerciseSyncService.ts`              |
| New     | `client/application/services/ProfileService.ts`                   |
| Update  | `client/application/services/ExerciseSessionService.ts`           |
| New     | `client/infrastructure/dexie/db.ts`                               |
| New     | `client/infrastructure/dexie/DexieExerciseRepository.ts`          |
| New     | `client/infrastructure/dexie/DexieSessionRepository.ts`           |
| New     | `client/infrastructure/dexie/DexieAnswerRepository.ts`            |
| New     | `client/infrastructure/dexie/container.ts`                        |
| New     | `app/api/exercises/meta/route.ts`                                 |
| New     | `app/api/exercises/all/route.ts`                                  |
| Update  | `server/application/exercise/ExerciseService.ts`                  |
| Update  | `server/infrastructure/http/ExerciseController.ts`                |
| Update  | `client/stores/sessionStore.ts`                                   |
| Update  | `presentation/web/pages/Profile/Profile.tsx`                      |
| New     | `presentation/web/pages/Profile/ui/StatsOverview/`                |
| New     | `presentation/web/pages/Profile/ui/TenseBreakdown/`               |
| New     | `presentation/web/pages/Profile/ui/SessionHistory/`               |
| New     | `presentation/web/pages/Profile/ui/SessionHistory/SessionDetail/` |
