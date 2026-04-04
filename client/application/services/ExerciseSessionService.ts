import type { ExerciseAnswer } from '@/domain/entities/Answer';
import type { Session } from '@/domain/entities/Session';
import { validateAnswer } from '@/domain/services/AnswerValidator';
import type { TenseType } from '@/domain/value-objects';
import { INFINITE_MODE_LIMIT, MAX_EXERCISES } from '@/shared/config/constants';
import type { FixedLimit, TrainingMode } from '@/shared/config/training';
import type { ExerciseResponseDto } from '@/shared/dtos';
import type { IAnswerRepository } from '../repositories/IAnswerRepository';
import type { IExerciseLocalRepository } from '../repositories/IExerciseLocalRepository';
import type { ISessionRepository } from '../repositories/ISessionRepository';

export type NextExerciseResult =
	| { type: 'advance'; nextIndex: number }
	| { type: 'complete' }
	| { type: 'fetchMore'; exercises: ExerciseResponseDto[]; nextIndex: number };

export class ExerciseSessionService {
	#exerciseLocal: IExerciseLocalRepository;
	#sessionRepo: ISessionRepository;
	#answerRepo: IAnswerRepository;

	constructor(
		exerciseLocalRepo: IExerciseLocalRepository,
		sessionRepo: ISessionRepository,
		answerRepo: IAnswerRepository,
	) {
		this.#exerciseLocal = exerciseLocalRepo;
		this.#sessionRepo = sessionRepo;
		this.#answerRepo = answerRepo;
	}

	async beginSession(
		tenses: TenseType[],
		mode: TrainingMode,
		fixedLimit: FixedLimit,
	): Promise<{ exercises: ExerciseResponseDto[]; sessionId: string }> {
		const activeSessions = await this.#sessionRepo.findActive();

		const now = new Date();

		await Promise.all(
			activeSessions.map(s => this.#sessionRepo.updateStatus(s.id, 'completed', now.toISOString())),
		);

		const exercises = await this.#exerciseLocal.findRandom(
			tenses,
			mode === 'fixed' ? fixedLimit : MAX_EXERCISES,
		);
		const sessionId = crypto.randomUUID();
		const session: Session = {
			id: sessionId,
			tenses,
			mode,
			fixedLimit,
			status: 'active',
			createdAt: new Date().toISOString(),
		};
		await this.#sessionRepo.create(session);
		return { exercises, sessionId };
	}

	async saveAnswer(
		exercise: ExerciseResponseDto,
		userAnswer: string,
		sessionId: string,
	): Promise<ExerciseAnswer> {
		const answer = this.#buildAnswer(exercise, userAnswer, sessionId);
		await this.#answerRepo.create(answer);
		return answer;
	}

	async completeSession(sessionId: string): Promise<void> {
		await this.#sessionRepo.updateStatus(sessionId, 'completed', new Date().toISOString());
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

	#buildAnswer(
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
