# Пример Zustand store в нашей архитектуре

Пример: `sessionStore` — управляет тренировочной сессией.

---

## `client/stores/sessionStore.ts`

```ts
import { create } from 'zustand';
import { ExerciseSessionService } from '@/client/application/ExerciseSessionService';
import type { Exercise } from '@/domain/entities/Exercise';
import type { ExerciseAnswer } from '@/domain/entities/Answer';
import type { Tense } from '@/domain/value-objects/Tense';

// Сервис создаётся один раз — инжектируется с Dexie-репозиториями
const sessionService = new ExerciseSessionService(
	new DexieExerciseRepository(db),
	new DexieProgressRepository(db),
);

type SessionState = {
	sessionId: string;
	exercises: Exercise[];
	currentExercise: Exercise | null;
	answers: ExerciseAnswer[];
	isLoading: boolean;
	error: string | null;
};

type SessionActions = {
	startSession(tenses: Tense[]): Promise<void>;
	submitAnswer(userAnswer: string): Promise<void>;
	skipExercise(): Promise<void>;
	next(): void;
	endSession(): void;
};

export const useSessionStore = create<SessionState & SessionActions>((set, get) => ({
	// --- начальное состояние ---
	sessionId: crypto.randomUUID(),
	exercises: [],
	currentExercise: null,
	answers: [],
	isLoading: false,
	error: null,

	// --- действия ---

	async startSession(tenses) {
		set({ isLoading: true, error: null });

		const exercises = await sessionService.loadExercises(tenses);
		const first = sessionService.nextExercise(exercises, 'random');

		set({
			exercises,
			currentExercise: first,
			answers: [],
			sessionId: crypto.randomUUID(),
			isLoading: false,
		});
	},

	async submitAnswer(userAnswer) {
		const { currentExercise, sessionId, exercises, answers } = get();
		if (!currentExercise) return;

		const answer = await sessionService.submitAnswer(currentExercise, userAnswer, sessionId);

		set({ answers: [...answers, answer] });
		get().next();
	},

	async skipExercise() {
		const { currentExercise, sessionId, exercises, answers } = get();
		if (!currentExercise) return;

		const answer = await sessionService.skipExercise(currentExercise, sessionId);

		set({ answers: [...answers, answer] });
		get().next();
	},

	next() {
		const { exercises } = get();
		const next = sessionService.nextExercise(exercises, 'random');
		set({ currentExercise: next });
	},

	endSession() {
		set({
			exercises: [],
			currentExercise: null,
			answers: [],
			sessionId: crypto.randomUUID(),
		});
	},
}));
```

---

## Как UI использует стор

```tsx
// presentation/web/pages/TenseTrainer/TenseTrainer.tsx

export function TenseTrainer() {
	const { currentExercise, isLoading, startSession, submitAnswer, skipExercise } =
		useSessionStore();

	// UI не знает про Dexie, сервисы, репозитории
	// Только вызывает методы стора и читает состояние
}
```

---

## Что стор делает и чего не делает

| Делает                                     | Не делает                                         |
| ------------------------------------------ | ------------------------------------------------- |
| Хранит runtime-состояние сессии            | Не содержит бизнес-логику ("правильный ли ответ") |
| Вызывает application services              | Не обращается к Dexie напрямую                    |
| Обновляет состояние после каждого действия | Не знает про HTTP или сервер                      |
| Предоставляет хук `useSessionStore` для UI | Не содержит JSX                                   |

---

## Цепочка вызовов для `submitAnswer`

```
UI (TenseTrainer)
  └─ useSessionStore().submitAnswer(userAnswer)
       └─ ExerciseSessionService.submitAnswer(exercise, userAnswer, sessionId)
            ├─ AnswerValidator.validate(userAnswer, exercise.answer)   ← domain/services
            └─ DexieProgressRepository.save(exerciseId, answer)        ← client/infrastructure
```

Каждый слой знает только про следующий внутренний. UI не знает про сервисы, сервисы не знают про Dexie напрямую (через интерфейс).
