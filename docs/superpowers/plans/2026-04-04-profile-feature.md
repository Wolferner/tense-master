# Profile Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Profile page that shows answer history and statistics, backed by Dexie (IndexedDB), with exercises synced from the server on startup.

**Architecture:** Exercises are fetched from the server once and cached in Dexie; subsequent visits only re-sync if the server has changes. Each training session and answer is written to Dexie in real-time. The Profile page reads from Dexie and computes stats via a pure `ProfileService`.

**Tech Stack:** Dexie (IndexedDB), dexie-react-hooks, Zustand, Next.js App Router, TypeScript

---

## File map

| Action  | File                                                                         |
| ------- | ---------------------------------------------------------------------------- |
| Install | `dexie`, `dexie-react-hooks`                                                 |
| Rewrite | `domain/entities/Answer.ts`                                                  |
| New     | `domain/entities/Session.ts`                                                 |
| New     | `client/application/repositories/IExerciseLocalRepository.ts`                |
| New     | `client/application/repositories/ISessionRepository.ts`                      |
| New     | `client/application/repositories/IAnswerRepository.ts`                       |
| Update  | `client/application/services/ExerciseSessionService.ts`                      |
| New     | `client/application/services/ExerciseSyncService.ts`                         |
| New     | `client/application/services/ProfileService.ts`                              |
| New     | `client/infrastructure/dexie/db.ts`                                          |
| New     | `client/infrastructure/dexie/DexieExerciseRepository.ts`                     |
| New     | `client/infrastructure/dexie/DexieSessionRepository.ts`                      |
| New     | `client/infrastructure/dexie/DexieAnswerRepository.ts`                       |
| New     | `client/infrastructure/dexie/container.ts`                                   |
| Delete  | `client/infrastructure/api/ExerciseApiRepository/container.ts`               |
| Update  | `client/stores/sessionStore.ts`                                              |
| Update  | `presentation/web/pages/TenseTrainer/ui/TrainingSection/TrainingSection.tsx` |
| New     | `presentation/web/components/SyncProvider/SyncProvider.tsx`                  |
| Update  | `app/(web)/layout.tsx`                                                       |
| New     | `app/api/exercises/meta/route.ts`                                            |
| New     | `app/api/exercises/all/route.ts`                                             |
| Update  | `server/application/exercise/ExerciseService.ts`                             |
| Update  | `server/infrastructure/http/ExerciseController.ts`                           |
| Update  | `presentation/web/pages/Profile/Profile.tsx`                                 |
| New     | `presentation/web/pages/Profile/useProfileData.ts`                           |
| New     | `presentation/web/pages/Profile/ui/StatsOverview/StatsOverview.tsx`          |
| New     | `presentation/web/pages/Profile/ui/TenseBreakdown/TenseBreakdown.tsx`        |
| New     | `presentation/web/pages/Profile/ui/SessionHistory/SessionHistory.tsx`        |
| New     | `presentation/web/pages/Profile/ui/SessionHistory/SessionDetail.tsx`         |

---

## Task 1: Install Dexie

**Files:** `package.json`

- [ ] **Step 1: Install packages**

```bash
npm install dexie dexie-react-hooks
```

- [ ] **Step 2: Verify install**

```bash
npm ls dexie
```

Expected: `dexie@x.x.x` present.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add dexie and dexie-react-hooks"
```

---

## Task 2: Add Session entity

**Files:**

- Create: `domain/entities/Session.ts`

- [ ] **Step 1: Create `domain/entities/Session.ts`**

```typescript
import type { TenseType } from '@/domain/value-objects';
import type { FixedLimit, TrainingMode } from '@/shared/config/training';

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

- [ ] **Step 2: Commit**

```bash
git add domain/entities/Session.ts
git commit -m "feat: add Session domain entity"
```

---

## Task 3: Add client repository interfaces

**Files:**

- Create: `client/application/repositories/IExerciseLocalRepository.ts`
- Create: `client/application/repositories/ISessionRepository.ts`
- Create: `client/application/repositories/IAnswerRepository.ts`

- [ ] **Step 1: Create `IExerciseLocalRepository.ts`**

```typescript
import type { TenseType } from '@/domain/value-objects';
import type { ExerciseResponseDto } from '@/shared/dtos';

export interface IExerciseLocalRepository {
	findRandom(tenses: TenseType[], limit: number): Promise<ExerciseResponseDto[]>;
	findById(id: string): Promise<ExerciseResponseDto | undefined>;
	findAll(): Promise<ExerciseResponseDto[]>;
	upsertMany(exercises: ExerciseResponseDto[]): Promise<void>;
}
```

- [ ] **Step 2: Create `ISessionRepository.ts`**

```typescript
import type { Session } from '@/domain/entities/Session';

export interface ISessionRepository {
	create(session: Session): Promise<void>;
	updateStatus(id: string, status: Session['status'], completedAt?: string): Promise<void>;
	findAll(): Promise<Session[]>;
	findById(id: string): Promise<Session | undefined>;
}
```

- [ ] **Step 3: Create `IAnswerRepository.ts`**

```typescript
import type { ExerciseAnswer } from '@/domain/entities/Answer';

export interface IAnswerRepository {
	create(answer: ExerciseAnswer): Promise<void>;
	findBySessionId(sessionId: string): Promise<ExerciseAnswer[]>;
	findAll(): Promise<ExerciseAnswer[]>;
}
```

- [ ] **Step 4: Commit**

```bash
git add client/application/repositories/IExerciseLocalRepository.ts \
        client/application/repositories/ISessionRepository.ts \
        client/application/repositories/IAnswerRepository.ts
git commit -m "feat: add client repository interfaces for local storage"
```

---

## Task 4: Add server endpoints — meta and all

**Files:**

- Modify: `server/application/exercise/ExerciseService.ts`
- Modify: `server/infrastructure/http/ExerciseController.ts`
- Create: `app/api/exercises/meta/route.ts`
- Create: `app/api/exercises/all/route.ts`

- [ ] **Step 1: Add `getLastUpdatedAt` and `findAll` to `ExerciseService.ts`**

Add these two methods to the existing `ExerciseService` class (after `findRandom`):

```typescript
async getLastUpdatedAt(): Promise<string | null> {
    const latest = await this.exerciseRepository.findLatestUpdatedAt();
    return latest ? latest.toISOString() : null;
}

async findAll(): Promise<ExerciseResponseDto[]> {
    const exercises = await this.exerciseRepository.findAll();
    return exercises.map(this.toDto);
}
```

- [ ] **Step 2: Add `findLatestUpdatedAt` and `findAll` to `IExerciseRepository`**

Open `domain/repositories/IExerciseRepository.ts` and add two methods:

```typescript
import { Exercise } from '../entities/Exercise';
import { Tense } from '../value-objects';

export interface IExerciseRepository {
	findRandom(tenses: Tense[], limit: number): Promise<Exercise[]>;
	create(exercise: Exercise): Promise<Exercise>;
	findLatestUpdatedAt(): Promise<Date | null>;
	findAll(): Promise<Exercise[]>;
}
```

- [ ] **Step 3: Implement in `PrismaExerciseRepository.ts`**

Open `server/infrastructure/prisma-orm/PrismaExerciseRepository.ts` and add these two methods to the class:

```typescript
async findLatestUpdatedAt(): Promise<Date | null> {
    const result = await this.prisma.tenseExerciseQuestion.findFirst({
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true },
    });
    return result?.updatedAt ?? null;
}

async findAll(): Promise<Exercise[]> {
    const rows = await this.prisma.tenseExerciseQuestion.findMany();
    return rows.map(
        row =>
            new Exercise(
                row.tense as Tense,
                row.question,
                row.answer,
                row.explanation,
                row.id,
                row.createdAt,
                row.updatedAt,
            ),
    );
}
```

You'll need to check the existing import for `Tense` and `Exercise` at the top of the file — they should already be there.

- [ ] **Step 4: Add controller methods to `ExerciseController.ts`**

Add these two methods to the existing `ExerciseController` class:

```typescript
async getMeta(): Promise<NextResponse> {
    const lastUpdatedAt = await this.exerciseService.getLastUpdatedAt();
    return NextResponse.json({ lastUpdatedAt }, { status: 200 });
}

async getAll(): Promise<NextResponse> {
    const exercises = await this.exerciseService.findAll();
    return NextResponse.json(exercises, { status: 200 });
}
```

- [ ] **Step 5: Create `app/api/exercises/meta/route.ts`**

```typescript
import { exerciseController } from '@/server/infrastructure/http/container';

export async function GET() {
	return exerciseController.getMeta();
}
```

- [ ] **Step 6: Create `app/api/exercises/all/route.ts`**

```typescript
import { exerciseController } from '@/server/infrastructure/http/container';

export async function GET() {
	return exerciseController.getAll();
}
```

- [ ] **Step 7: Commit**

```bash
git add domain/repositories/IExerciseRepository.ts \
        server/application/exercise/ExerciseService.ts \
        server/infrastructure/prisma-orm/PrismaExerciseRepository.ts \
        server/infrastructure/http/ExerciseController.ts \
        app/api/exercises/meta/route.ts \
        app/api/exercises/all/route.ts
git commit -m "feat: add /api/exercises/meta and /api/exercises/all endpoints"
```

---

## Task 5: Dexie schema

**Files:**

- Create: `client/infrastructure/dexie/db.ts`

- [ ] **Step 1: Create `client/infrastructure/dexie/db.ts`**

```typescript
import Dexie, { type Table } from 'dexie';
import type { ExerciseAnswer } from '@/domain/entities/Answer';
import type { Session } from '@/domain/entities/Session';
import type { ExerciseResponseDto } from '@/shared/dtos';

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

export const db = new TenseMasterDb();
```

- [ ] **Step 2: Commit**

```bash
git add client/infrastructure/dexie/db.ts
git commit -m "feat: add Dexie database schema"
```

---

## Task 6: DexieExerciseRepository

**Files:**

- Create: `client/infrastructure/dexie/DexieExerciseRepository.ts`

- [ ] **Step 1: Create `DexieExerciseRepository.ts`**

```typescript
import type { IExerciseLocalRepository } from '@/client/application/repositories/IExerciseLocalRepository';
import type { TenseType } from '@/domain/value-objects';
import type { ExerciseResponseDto } from '@/shared/dtos';
import type { TenseMasterDb } from './db';

export class DexieExerciseRepository implements IExerciseLocalRepository {
	constructor(private readonly db: TenseMasterDb) {}

	async findRandom(tenses: TenseType[], limit: number): Promise<ExerciseResponseDto[]> {
		const pool = await this.db.exercises.where('tense').anyOf(tenses).toArray();
		const shuffled = pool.sort(() => Math.random() - 0.5);
		if (shuffled.length === 0) return [];
		if (shuffled.length >= limit) return shuffled.slice(0, limit);
		return Array.from({ length: limit }, (_, i) => shuffled[i % shuffled.length]);
	}

	async findById(id: string): Promise<ExerciseResponseDto | undefined> {
		return this.db.exercises.get(id);
	}

	async findAll(): Promise<ExerciseResponseDto[]> {
		return this.db.exercises.toArray();
	}

	async upsertMany(exercises: ExerciseResponseDto[]): Promise<void> {
		await this.db.exercises.bulkPut(exercises);
	}
}
```

Note: `db.ts` exports `db` (instance) but the class is not exported by default. Update `db.ts` to also export the class type:

```typescript
// add at the bottom of db.ts:
export type { TenseMasterDb };
```

- [ ] **Step 2: Commit**

```bash
git add client/infrastructure/dexie/db.ts \
        client/infrastructure/dexie/DexieExerciseRepository.ts
git commit -m "feat: add DexieExerciseRepository"
```

---

## Task 7: DexieSessionRepository and DexieAnswerRepository

**Files:**

- Create: `client/infrastructure/dexie/DexieSessionRepository.ts`
- Create: `client/infrastructure/dexie/DexieAnswerRepository.ts`

- [ ] **Step 1: Create `DexieSessionRepository.ts`**

```typescript
import type { ISessionRepository } from '@/client/application/repositories/ISessionRepository';
import type { Session } from '@/domain/entities/Session';
import type { TenseMasterDb } from './db';

export class DexieSessionRepository implements ISessionRepository {
	constructor(private readonly db: TenseMasterDb) {}

	async create(session: Session): Promise<void> {
		await this.db.sessions.put(session);
	}

	async updateStatus(id: string, status: Session['status'], completedAt?: string): Promise<void> {
		await this.db.sessions.update(id, { status, ...(completedAt ? { completedAt } : {}) });
	}

	async findAll(): Promise<Session[]> {
		return this.db.sessions.orderBy('createdAt').reverse().toArray();
	}

	async findById(id: string): Promise<Session | undefined> {
		return this.db.sessions.get(id);
	}
}
```

- [ ] **Step 2: Create `DexieAnswerRepository.ts`**

```typescript
import type { IAnswerRepository } from '@/client/application/repositories/IAnswerRepository';
import type { ExerciseAnswer } from '@/domain/entities/Answer';
import type { TenseMasterDb } from './db';

export class DexieAnswerRepository implements IAnswerRepository {
	constructor(private readonly db: TenseMasterDb) {}

	async create(answer: ExerciseAnswer): Promise<void> {
		await this.db.answers.put(answer);
	}

	async findBySessionId(sessionId: string): Promise<ExerciseAnswer[]> {
		return this.db.answers.where('sessionId').equals(sessionId).toArray();
	}

	async findAll(): Promise<ExerciseAnswer[]> {
		return this.db.answers.orderBy('createdAt').toArray();
	}
}
```

- [ ] **Step 3: Commit**

```bash
git add client/infrastructure/dexie/DexieSessionRepository.ts \
        client/infrastructure/dexie/DexieAnswerRepository.ts
git commit -m "feat: add DexieSessionRepository and DexieAnswerRepository"
```

---

## Task 8: Dexie container and ExerciseSyncService

**Files:**

- Create: `client/infrastructure/dexie/container.ts`
- Create: `client/application/services/ExerciseSyncService.ts`

- [ ] **Step 1: Create `ExerciseSyncService.ts`**

```typescript
import type { IExerciseLocalRepository } from '@/client/application/repositories/IExerciseLocalRepository';
import type { ExerciseResponseDto } from '@/shared/dtos';

const LAST_SYNCED_KEY = 'tense-last-synced';

export class ExerciseSyncService {
	constructor(private readonly local: IExerciseLocalRepository) {}

	async sync(): Promise<void> {
		try {
			const meta: { lastUpdatedAt: string | null } = await fetch('/api/exercises/meta').then(r =>
				r.json(),
			);
			if (!meta.lastUpdatedAt) return;

			const lastSynced = localStorage.getItem(LAST_SYNCED_KEY);
			if (lastSynced === meta.lastUpdatedAt) return;

			const exercises: ExerciseResponseDto[] = await fetch('/api/exercises/all').then(r =>
				r.json(),
			);
			await this.local.upsertMany(exercises);
			localStorage.setItem(LAST_SYNCED_KEY, meta.lastUpdatedAt);
		} catch {
			// offline or server error — use existing local data
		}
	}
}
```

- [ ] **Step 2: Create `client/infrastructure/dexie/container.ts`**

```typescript
import { ExerciseSessionService } from '@/client/application/services/ExerciseSessionService';
import { ExerciseSyncService } from '@/client/application/services/ExerciseSyncService';
import { db } from './db';
import { DexieAnswerRepository } from './DexieAnswerRepository';
import { DexieExerciseRepository } from './DexieExerciseRepository';
import { DexieSessionRepository } from './DexieSessionRepository';

export const exerciseLocalRepository = new DexieExerciseRepository(db);
export const sessionRepository = new DexieSessionRepository(db);
export const answerRepository = new DexieAnswerRepository(db);

export const exerciseSessionService = new ExerciseSessionService(exerciseLocalRepository);
export const exerciseSyncService = new ExerciseSyncService(exerciseLocalRepository);
```

- [ ] **Step 3: Commit**

```bash
git add client/application/services/ExerciseSyncService.ts \
        client/infrastructure/dexie/container.ts
git commit -m "feat: add ExerciseSyncService and Dexie container"
```

---

## Task 9: Rewrite Answer entity + update ExerciseSessionService

**Files:**

- Rewrite: `domain/entities/Answer.ts`
- Modify: `client/application/services/ExerciseSessionService.ts`

Note: `ExerciseSessionService` also switches from `IExerciseApiRepository` to `IExerciseLocalRepository` in this task.

- [ ] **Step 1: Rewrite `domain/entities/Answer.ts`**

```typescript
export type ExerciseAnswer = {
	id: string;
	sessionId: string;
	exerciseId: string;
	userAnswer: string;
	skipped: boolean;
	isCorrect: boolean | null;
	createdAt: string;
};
```

- [ ] **Step 2: Rewrite `ExerciseSessionService.ts`**

The service now uses `IExerciseLocalRepository` for both `loadExercises` and `resolveNext`. `createAnswer` is updated for the new flat type.

```typescript
import type { ExerciseAnswer } from '@/domain/entities/Answer';
import { validateAnswer } from '@/domain/services/AnswerValidator';
import type { TenseType } from '@/domain/value-objects';
import type { ExerciseResponseDto } from '@/shared/dtos';
import { INFINITE_MODE_LIMIT, MAX_EXERCISES } from '@/shared/config/constants';
import type { FixedLimit, TrainingMode } from '@/shared/config/training';
import type { IExerciseLocalRepository } from '../repositories/IExerciseLocalRepository';

export type NextExerciseResult =
	| { type: 'advance'; nextIndex: number }
	| { type: 'complete' }
	| { type: 'fetchMore'; exercises: ExerciseResponseDto[]; nextIndex: number };

export class ExerciseSessionService {
	#exerciseLocal: IExerciseLocalRepository;

	constructor(exerciseLocalRepo: IExerciseLocalRepository) {
		this.#exerciseLocal = exerciseLocalRepo;
	}

	async loadExercises(
		tenses: TenseType[],
		mode: TrainingMode,
		fixedLimit: FixedLimit,
	): Promise<ExerciseResponseDto[]> {
		return this.#exerciseLocal.findRandom(tenses, mode === 'fixed' ? fixedLimit : MAX_EXERCISES);
	}

	async resolveNext(
		currentIndex: number,
		exercises: ExerciseResponseDto[],
		tenses: TenseType[],
		mode: TrainingMode,
	): Promise<NextExerciseResult> {
		if (currentIndex + 1 < exercises.length) {
			return { type: 'advance', nextIndex: currentIndex + 1 };
		}
		if (mode === 'fixed') {
			return { type: 'complete' };
		}
		const more = await this.#exerciseLocal.findRandom(tenses, INFINITE_MODE_LIMIT);
		return { type: 'fetchMore', exercises: more, nextIndex: currentIndex + 1 };
	}

	createAnswer(
		exercise: ExerciseResponseDto,
		userAnswer: string,
		sessionId: string,
	): ExerciseAnswer {
		const skipped = userAnswer.trim().length === 0;
		return {
			id: crypto.randomUUID(),
			sessionId,
			exerciseId: exercise.id,
			userAnswer,
			skipped,
			isCorrect: skipped ? null : validateAnswer(userAnswer, exercise.answer),
			createdAt: new Date().toISOString(),
		};
	}
}
```

- [ ] **Step 3: Commit**

```bash
git add domain/entities/Answer.ts \
        client/application/services/ExerciseSessionService.ts
git commit -m "feat: rewrite ExerciseAnswer entity and switch ExerciseSessionService to local repo"
```

---

## Task 10: Update sessionStore + TrainingSection + delete old container

After this task the full answer/session write-through to Dexie is live.

**Files:**

- Rewrite: `client/stores/sessionStore.ts`
- Modify: `presentation/web/pages/TenseTrainer/ui/TrainingSection/TrainingSection.tsx`
- Delete: `client/infrastructure/api/ExerciseApiRepository/container.ts`

- [ ] **Step 1: Rewrite `client/stores/sessionStore.ts`**

```typescript
'use client';

import {
	answerRepository,
	exerciseSessionService,
	sessionRepository,
} from '@/client/infrastructure/dexie/container';
import type { ExerciseAnswer } from '@/domain/entities/Answer';
import type { Session } from '@/domain/entities/Session';
import type { TenseType } from '@/domain/value-objects';
import type { ExerciseResponseDto } from '@/shared/dtos';
import type { FixedLimit, Step, TrainingMode } from '@/shared/config/training';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SessionState = {
	exercises: ExerciseResponseDto[];
	currentAnswer: ExerciseAnswer | null;
	sessionId: string;
	step: Step;
	currentExerciseIndex: number;
	isLoading: boolean;
};

type SessionActions = {
	setStep(step: Step): void;
	submitAnswer(answer: string, exerciseId: string): Promise<void>;
	startTraining(tenses: TenseType[], mode: TrainingMode, fixedLimit: FixedLimit): Promise<void>;
	nextExercise(tenses: TenseType[], mode: TrainingMode): Promise<void>;
};

export type SessionStore = SessionState & SessionActions;

export const useSessionStore = create<SessionStore>()(
	persist(
		(set, get) => ({
			exercises: [],
			currentAnswer: null,
			sessionId: '',
			step: 'select',
			currentExerciseIndex: 0,
			isLoading: false,

			setStep: step => set({ step }),

			submitAnswer: async (answer, exerciseId) => {
				const { exercises, sessionId } = get();
				const exercise = exercises.find(e => e.id === exerciseId);
				if (!exercise) return;
				const record = exerciseSessionService.createAnswer(exercise, answer, sessionId);
				await answerRepository.create(record);
				set({ currentAnswer: record });
			},

			startTraining: async (tenses, mode, fixedLimit) => {
				if (tenses.length === 0) return;
				set({ isLoading: true });
				const exercises = await exerciseSessionService.loadExercises(tenses, mode, fixedLimit);
				const sessionId = crypto.randomUUID();
				const session: Session = {
					id: sessionId,
					tenses,
					mode,
					fixedLimit,
					status: 'active',
					createdAt: new Date().toISOString(),
				};
				await sessionRepository.create(session);
				set({
					exercises,
					sessionId,
					currentExerciseIndex: 0,
					currentAnswer: null,
					step: 'training',
					isLoading: false,
				});
			},

			nextExercise: async (tenses, mode) => {
				const { currentExerciseIndex, exercises, sessionId } = get();
				set({ isLoading: true });
				const result = await exerciseSessionService.resolveNext(
					currentExerciseIndex,
					exercises,
					tenses,
					mode,
				);
				if (result.type === 'advance') {
					set({ currentExerciseIndex: result.nextIndex, currentAnswer: null, isLoading: false });
				} else if (result.type === 'complete') {
					await sessionRepository.updateStatus(sessionId, 'completed', new Date().toISOString());
					set({ step: 'select', currentAnswer: null, isLoading: false });
				} else {
					set(prev => ({
						exercises: [...prev.exercises, ...result.exercises],
						currentExerciseIndex: result.nextIndex,
						currentAnswer: null,
						isLoading: false,
					}));
				}
			},
		}),
		{
			name: 'tense-session',
			partialize: state => ({
				exercises: state.exercises,
				sessionId: state.sessionId,
				step: state.step,
				currentExerciseIndex: state.currentExerciseIndex,
				currentAnswer: state.currentAnswer,
			}),
		},
	),
);
```

- [ ] **Step 2: Update `TrainingSection.tsx`**

Replace the `answers` reference with `currentAnswer`. The changed lines are:

```typescript
// Remove 'answers' from the useShallow selector, add 'currentAnswer':
const {
	sessionId,
	exercises,
	currentExerciseIndex,
	isLoading,
	currentAnswer, // replaces 'answers'
	setStep,
	nextExercise,
	submitAnswer,
} = useSessionStore(
	useShallow(s => ({
		sessionId: s.sessionId,
		exercises: s.exercises,
		currentExerciseIndex: s.currentExerciseIndex,
		isLoading: s.isLoading,
		currentAnswer: s.currentAnswer, // replaces s.answers
		setStep: s.setStep,
		nextExercise: s.nextExercise,
		submitAnswer: s.submitAnswer,
	})),
);
```

Replace the `answerRecord` derivation and initial state:

```typescript
// Before:
const answerRecord = answers[current.id]?.findLast(a => a.sessionId === sessionId);
const [userAnswer, setUserAnswer] = useState(answerRecord?.answer ?? '');

// After:
const answerRecord = currentAnswer?.exerciseId === current.id ? currentAnswer : null;
const [userAnswer, setUserAnswer] = useState(answerRecord?.userAnswer ?? '');
```

Update the `submitAnswer` call (it's now async, but the `onClick` handler can fire-and-forget):

```typescript
// Before:
onClick={() => submitAnswer(userAnswer, current.id)}

// After:
onClick={() => void submitAnswer(userAnswer, current.id)}
```

Remove the unused `sessionId` from the selector since it's no longer used in the component body.

- [ ] **Step 3: Delete old container**

```bash
git rm client/infrastructure/api/ExerciseApiRepository/container.ts
```

- [ ] **Step 4: Commit**

```bash
git add client/stores/sessionStore.ts \
        presentation/web/pages/TenseTrainer/ui/TrainingSection/TrainingSection.tsx
git commit -m "feat: wire sessionStore to Dexie for answers and sessions"
```

---

## Task 11: Wire sync on app start

**Files:**

- Create: `presentation/web/components/SyncProvider/SyncProvider.tsx`
- Modify: `app/(web)/layout.tsx`

- [ ] **Step 1: Create `SyncProvider.tsx`**

```typescript
'use client';

import { exerciseSyncService } from '@/client/infrastructure/dexie/container';
import { useEffect } from 'react';

export function SyncProvider() {
	useEffect(() => {
		void exerciseSyncService.sync();
	}, []);
	return null;
}
```

- [ ] **Step 2: Update `app/(web)/layout.tsx`**

```typescript
import InstallBanner from '@/presentation/web/components/InstallBanner/InstallBanner';
import Header from '@/presentation/web/components/Header/Header';
import { SyncProvider } from '@/presentation/web/components/SyncProvider/SyncProvider';

export default function WebLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex min-h-screen flex-col'>
			<SyncProvider />
			<Header />
			<div className='flex flex-1 flex-col'>{children}</div>
			<InstallBanner />
		</div>
	);
}
```

- [ ] **Step 3: Commit**

```bash
git add presentation/web/components/SyncProvider/SyncProvider.tsx \
        app/(web)/layout.tsx
git commit -m "feat: sync exercises from server on app start"
```

---

## Task 12: ProfileService

**Files:**

- Create: `client/application/services/ProfileService.ts`

- [ ] **Step 1: Create `ProfileService.ts`**

```typescript
import type { ExerciseAnswer } from '@/domain/entities/Answer';
import type { Session } from '@/domain/entities/Session';
import type { TenseType } from '@/domain/value-objects';
import type { ExerciseResponseDto } from '@/shared/dtos';

export type OverallStats = {
	total: number;
	correct: number;
	skipped: number;
	accuracy: number;
};

export type TenseStat = {
	tense: TenseType;
	total: number;
	correct: number;
	accuracy: number;
};

export type SessionSummary = {
	session: Session;
	total: number;
	correct: number;
	skipped: number;
	accuracy: number;
};

export type AnswerWithExercise = ExerciseAnswer & { exercise: ExerciseResponseDto };

function pct(correct: number, attempted: number): number {
	return attempted === 0 ? 0 : Math.round((correct / attempted) * 100);
}

export class ProfileService {
	getOverallStats(answers: ExerciseAnswer[]): OverallStats {
		const total = answers.length;
		const skipped = answers.filter(a => a.skipped).length;
		const correct = answers.filter(a => !a.skipped && a.isCorrect).length;
		return { total, correct, skipped, accuracy: pct(correct, total - skipped) };
	}

	getTenseStats(answers: ExerciseAnswer[], exercises: ExerciseResponseDto[]): TenseStat[] {
		const exerciseMap = new Map(exercises.map(e => [e.id, e]));
		const byTense = new Map<TenseType, ExerciseAnswer[]>();

		for (const answer of answers) {
			const exercise = exerciseMap.get(answer.exerciseId);
			if (!exercise) continue;
			const tense = exercise.tense as TenseType;
			byTense.set(tense, [...(byTense.get(tense) ?? []), answer]);
		}

		return Array.from(byTense.entries()).map(([tense, tenseAnswers]) => {
			const total = tenseAnswers.length;
			const skipped = tenseAnswers.filter(a => a.skipped).length;
			const correct = tenseAnswers.filter(a => !a.skipped && a.isCorrect).length;
			return { tense, total, correct, accuracy: pct(correct, total - skipped) };
		});
	}

	getSessionSummaries(sessions: Session[], answers: ExerciseAnswer[]): SessionSummary[] {
		return sessions
			.map(session => {
				const sa = answers.filter(a => a.sessionId === session.id);
				const total = sa.length;
				const skipped = sa.filter(a => a.skipped).length;
				const correct = sa.filter(a => !a.skipped && a.isCorrect).length;
				return { session, total, correct, skipped, accuracy: pct(correct, total - skipped) };
			})
			.sort(
				(a, b) => new Date(b.session.createdAt).getTime() - new Date(a.session.createdAt).getTime(),
			);
	}

	joinAnswersWithExercises(
		answers: ExerciseAnswer[],
		exercises: ExerciseResponseDto[],
	): AnswerWithExercise[] {
		const exerciseMap = new Map(exercises.map(e => [e.id, e]));
		return answers.flatMap(a => {
			const exercise = exerciseMap.get(a.exerciseId);
			return exercise ? [{ ...a, exercise }] : [];
		});
	}
}

export const profileService = new ProfileService();
```

- [ ] **Step 2: Commit**

```bash
git add client/application/services/ProfileService.ts
git commit -m "feat: add ProfileService for stats computation"
```

---

## Task 13: useProfileData hook

**Files:**

- Create: `presentation/web/pages/Profile/useProfileData.ts`

- [ ] **Step 1: Create `useProfileData.ts`**

```typescript
'use client';

import {
	answerRepository,
	exerciseLocalRepository,
	sessionRepository,
} from '@/client/infrastructure/dexie/container';
import {
	profileService,
	type AnswerWithExercise,
	type OverallStats,
	type SessionSummary,
	type TenseStat,
} from '@/client/application/services/ProfileService';
import { useLiveQuery } from 'dexie-react-hooks';

type ProfileData = {
	overallStats: OverallStats;
	tenseStats: TenseStat[];
	sessionSummaries: SessionSummary[];
	getSessionAnswers: (sessionId: string) => AnswerWithExercise[];
	isLoading: boolean;
};

export function useProfileData(): ProfileData {
	const data = useLiveQuery(async () => {
		const [sessions, answers, exercises] = await Promise.all([
			sessionRepository.findAll(),
			answerRepository.findAll(),
			exerciseLocalRepository.findAll(),
		]);
		return { sessions, answers, exercises };
	});

	if (!data) {
		return {
			overallStats: { total: 0, correct: 0, skipped: 0, accuracy: 0 },
			tenseStats: [],
			sessionSummaries: [],
			getSessionAnswers: () => [],
			isLoading: true,
		};
	}

	const { sessions, answers, exercises } = data;
	const allAnswersWithExercise = profileService.joinAnswersWithExercises(answers, exercises);

	return {
		overallStats: profileService.getOverallStats(answers),
		tenseStats: profileService.getTenseStats(answers, exercises),
		sessionSummaries: profileService.getSessionSummaries(sessions, answers),
		getSessionAnswers: (sessionId: string) =>
			allAnswersWithExercise.filter(a => a.sessionId === sessionId),
		isLoading: false,
	};
}
```

- [ ] **Step 2: Commit**

```bash
git add presentation/web/pages/Profile/useProfileData.ts
git commit -m "feat: add useProfileData hook"
```

---

## Task 14: StatsOverview component

**Files:**

- Create: `presentation/web/pages/Profile/ui/StatsOverview/StatsOverview.tsx`

- [ ] **Step 1: Create `StatsOverview.tsx`**

```typescript
import type { OverallStats } from '@/client/application/services/ProfileService';

interface Props {
	stats: OverallStats;
}

export function StatsOverview({ stats }: Props) {
	return (
		<div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
			<StatCard label='Всего' value={String(stats.total)} />
			<StatCard label='Правильно' value={`${stats.correct}`} sub={`${stats.accuracy}%`} />
			<StatCard label='Пропущено' value={String(stats.skipped)} />
			<StatCard
				label='Неверно'
				value={String(stats.total - stats.correct - stats.skipped)}
			/>
		</div>
	);
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
	return (
		<div className='border-border bg-card rounded-xl border p-4'>
			<p className='text-muted-foreground text-xs font-semibold tracking-wide uppercase'>{label}</p>
			<p className='text-foreground text-2xl font-bold'>{value}</p>
			{sub && <p className='text-muted-foreground text-sm'>{sub}</p>}
		</div>
	);
}
```

- [ ] **Step 2: Commit**

```bash
git add presentation/web/pages/Profile/ui/StatsOverview/StatsOverview.tsx
git commit -m "feat: add StatsOverview component"
```

---

## Task 15: TenseBreakdown component

**Files:**

- Create: `presentation/web/pages/Profile/ui/TenseBreakdown/TenseBreakdown.tsx`

- [ ] **Step 1: Create `TenseBreakdown.tsx`**

Tense labels already exist at `presentation/web/pages/TenseTrainer/logic/tenseLabels.ts` — import from there.

```typescript
import type { TenseStat } from '@/client/application/services/ProfileService';
import { TENSE_LABELS } from '@/presentation/web/pages/TenseTrainer/logic/tenseLabels';

interface Props {
	stats: TenseStat[];
}

export function TenseBreakdown({ stats }: Props) {
	if (stats.length === 0) {
		return <p className='text-muted-foreground text-sm'>Нет данных</p>;
	}

	return (
		<div className='flex flex-col gap-3'>
			{stats.map(s => (
				<div key={s.tense} className='flex items-center gap-4'>
					<span className='text-foreground w-48 shrink-0 text-sm'>{TENSE_LABELS[s.tense]}</span>
					<div className='bg-muted relative h-2 flex-1 overflow-hidden rounded-full'>
						<div
							className='bg-primary absolute inset-y-0 left-0 rounded-full'
							style={{ width: `${s.accuracy}%` }}
						/>
					</div>
					<span className='text-muted-foreground w-10 text-right text-sm'>{s.accuracy}%</span>
					<span className='text-muted-foreground text-sm'>({s.total})</span>
				</div>
			))}
		</div>
	);
}
```

- [ ] **Step 2: Commit**

```bash
git add presentation/web/pages/Profile/ui/TenseBreakdown/TenseBreakdown.tsx
git commit -m "feat: add TenseBreakdown component"
```

---

## Task 16: SessionHistory and SessionDetail components

**Files:**

- Create: `presentation/web/pages/Profile/ui/SessionHistory/SessionHistory.tsx`
- Create: `presentation/web/pages/Profile/ui/SessionHistory/SessionDetail.tsx`

- [ ] **Step 1: Create `SessionDetail.tsx`**

```typescript
import type { AnswerWithExercise } from '@/client/application/services/ProfileService';
import { TENSE_LABELS } from '@/presentation/web/pages/TenseTrainer/logic/tenseLabels';

interface Props {
	answers: AnswerWithExercise[];
}

export function SessionDetail({ answers }: Props) {
	if (answers.length === 0) {
		return <p className='text-muted-foreground py-2 text-sm'>Нет ответов</p>;
	}

	return (
		<div className='flex flex-col gap-2 pt-2'>
			{answers.map(a => (
				<div key={a.id} className='border-border bg-background rounded-lg border p-3'>
					<div className='mb-1 flex items-center justify-between'>
						<span className='text-muted-foreground text-xs'>{TENSE_LABELS[a.exercise.tense]}</span>
						{a.skipped ? (
							<span className='text-muted-foreground text-xs'>Пропущено</span>
						) : (
							<span
								className={`text-xs font-medium ${a.isCorrect ? 'text-green-600' : 'text-red-500'}`}
							>
								{a.isCorrect ? 'Верно' : 'Неверно'}
							</span>
						)}
					</div>
					<p className='text-foreground text-sm'>{a.exercise.question}</p>
					{!a.skipped && (
						<p className='text-muted-foreground mt-1 text-xs'>
							Ответ: <span className='text-foreground'>{a.userAnswer}</span>
						</p>
					)}
				</div>
			))}
		</div>
	);
}
```

- [ ] **Step 2: Create `SessionHistory.tsx`**

```typescript
'use client';

import type { AnswerWithExercise, SessionSummary } from '@/client/application/services/ProfileService';
import { Badge } from '@/presentation/components/ui/badge';
import { TENSE_LABELS } from '@/presentation/web/pages/TenseTrainer/logic/tenseLabels';
import { useState } from 'react';
import { SessionDetail } from './SessionDetail';

interface Props {
	summaries: SessionSummary[];
	getSessionAnswers: (sessionId: string) => AnswerWithExercise[];
}

export function SessionHistory({ summaries, getSessionAnswers }: Props) {
	const [openId, setOpenId] = useState<string | null>(null);

	if (summaries.length === 0) {
		return <p className='text-muted-foreground text-sm'>История пуста</p>;
	}

	return (
		<div className='flex flex-col gap-3'>
			{summaries.map(({ session, total, correct, skipped, accuracy }) => {
				const isOpen = openId === session.id;
				const date = new Date(session.createdAt).toLocaleDateString('ru-RU', {
					day: 'numeric',
					month: 'short',
					hour: '2-digit',
					minute: '2-digit',
				});

				return (
					<div key={session.id} className='border-border bg-card rounded-xl border'>
						<button
							className='flex w-full items-start justify-between gap-4 p-4 text-left'
							onClick={() => setOpenId(isOpen ? null : session.id)}
						>
							<div className='flex flex-col gap-1'>
								<span className='text-foreground text-sm font-medium'>{date}</span>
								<div className='flex flex-wrap gap-1'>
									{session.tenses.map(t => (
										<Badge key={t} variant='outline' className='text-xs'>
											{TENSE_LABELS[t]}
										</Badge>
									))}
								</div>
							</div>
							<div className='text-muted-foreground shrink-0 text-right text-sm'>
								<p>
									{correct}/{total - skipped} верно
								</p>
								<p>{accuracy}%</p>
							</div>
						</button>

						{isOpen && (
							<div className='border-border border-t px-4 pb-4'>
								<SessionDetail answers={getSessionAnswers(session.id)} />
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
```

- [ ] **Step 3: Commit**

```bash
git add presentation/web/pages/Profile/ui/SessionHistory/SessionDetail.tsx \
        presentation/web/pages/Profile/ui/SessionHistory/SessionHistory.tsx
git commit -m "feat: add SessionHistory and SessionDetail components"
```

---

## Task 17: Wire Profile page

**Files:**

- Rewrite: `presentation/web/pages/Profile/Profile.tsx`

- [ ] **Step 1: Rewrite `Profile.tsx`**

```typescript
'use client';

import { StatsOverview } from './ui/StatsOverview/StatsOverview';
import { TenseBreakdown } from './ui/TenseBreakdown/TenseBreakdown';
import { SessionHistory } from './ui/SessionHistory/SessionHistory';
import { useProfileData } from './useProfileData';

const ProfilePage = () => {
	const { overallStats, tenseStats, sessionSummaries, getSessionAnswers, isLoading } =
		useProfileData();

	if (isLoading) {
		return (
			<main className='flex flex-1 items-center justify-center'>
				<p className='text-muted-foreground text-sm'>Загрузка...</p>
			</main>
		);
	}

	return (
		<main className='bg-background text-foreground flex flex-1 flex-col'>
			<div className='mx-auto flex w-full max-w-2xl flex-col gap-10 px-6 py-16'>
				<section>
					<h2 className='text-foreground mb-4 text-lg font-semibold'>Общая статистика</h2>
					<StatsOverview stats={overallStats} />
				</section>

				<section>
					<h2 className='text-foreground mb-4 text-lg font-semibold'>По временам</h2>
					<TenseBreakdown stats={tenseStats} />
				</section>

				<section>
					<h2 className='text-foreground mb-4 text-lg font-semibold'>История сессий</h2>
					<SessionHistory summaries={sessionSummaries} getSessionAnswers={getSessionAnswers} />
				</section>
			</div>
		</main>
	);
};

export default ProfilePage;
```

- [ ] **Step 2: Commit**

```bash
git add presentation/web/pages/Profile/Profile.tsx
git commit -m "feat: implement Profile page with stats and session history"
```

---

## Self-review notes

- `TrainingSection` no longer needs `sessionId` in the selector after Task 10 — remove it from `useShallow`.
- `TenseType` import in `ProfileService` is `@/domain/value-objects` — already used in other files, consistent.
- `TENSE_LABELS` is imported from `presentation/web/pages/TenseTrainer/logic/tenseLabels.ts` in both `TenseBreakdown` and `SessionHistory/SessionDetail` — verify this file exports `TENSE_LABELS` as a `Record<TenseType, string>` before Task 15.
- `db.ts` exports `TenseMasterDb` as a type only — the constructor is private from outside via the `db` singleton. `DexieExerciseRepository` receives the instance, not the class. The `TenseMasterDb` type export is only needed for the constructor parameter type in the repository classes.
- `ExerciseResponseDto.createdAt` and `updatedAt` are `Date` objects (not strings). Dexie stores them as-is in IndexedDB. When reading back, they'll be `Date` objects — no conversion needed.
