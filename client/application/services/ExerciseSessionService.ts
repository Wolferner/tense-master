import { type ExerciseAnswer } from '@/domain/entities/Answer';
import { validateAnswer } from '@/domain/services/AnswerValidator';
import { type TenseType } from '@/domain/value-objects';
import { type ExerciseResponseDto } from '@/shared/dtos';
import { INFINITE_MODE_LIMIT, MAX_EXERCISES } from '@/shared/config/constants';
import type { FixedLimit, TrainingMode } from '@/shared/config/training';
import { type IExerciseApiRepository } from '../repositories/IExerciseApiRepository';

export type NextExerciseResult =
	| { type: 'advance'; nextIndex: number }
	| { type: 'complete' }
	| { type: 'fetchMore'; exercises: ExerciseResponseDto[]; nextIndex: number };

export class ExerciseSessionService {
	#exerciseApi: IExerciseApiRepository;

	constructor(exerciseRepo: IExerciseApiRepository) {
		this.#exerciseApi = exerciseRepo;
	}

	async loadExercises(
		tenses: TenseType[],
		mode: TrainingMode,
		fixedLimit: FixedLimit,
	): Promise<ExerciseResponseDto[]> {
		return this.#exerciseApi.findRandom(tenses, mode === 'fixed' ? fixedLimit : MAX_EXERCISES);
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
		const more = await this.#exerciseApi.findRandom(tenses, INFINITE_MODE_LIMIT);
		return { type: 'fetchMore', exercises: more, nextIndex: currentIndex + 1 };
	}

	createAnswer(
		exercise: ExerciseResponseDto,
		userAnswer: string,
		sessionId: string,
	): ExerciseAnswer {
		const skipped = userAnswer.trim().length === 0;
		const createdAt = new Date().toISOString();
		if (skipped) {
			return { answer: userAnswer, skipped: true, createdAt, sessionId };
		}
		return {
			answer: userAnswer,
			skipped: false,
			isCorrect: validateAnswer(userAnswer, exercise.answer),
			createdAt,
			sessionId,
		};
	}
}
