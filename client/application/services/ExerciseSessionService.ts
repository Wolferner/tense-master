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
