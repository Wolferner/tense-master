import { ExerciseAnswer } from '@/domain/entities/Answer';
import { Session } from '@/domain/entities/Session';
import { validateAnswer } from '@/domain/services/AnswerValidator';
import type { Locale, TenseType } from '@/domain/value-objects';
import { INFINITE_MODE_LIMIT, MAX_EXERCISES } from '@/shared/config/constants';
import type { FixedLimit, TrainingMode } from '@/shared/config/training';
import type { ExerciseResponseDto } from '@/shared/dtos';
import type { IAnswerRepository } from '../repositories/IAnswerRepository';
import type { IExerciseRepository } from '../repositories/IExerciseRepository';
import type { ISessionRepository } from '../repositories/ISessionRepository';

export type NextExerciseResult =
	| { type: 'advance'; nextIndex: number }
	| { type: 'complete' }
	| { type: 'fetchMore'; exercises: ExerciseResponseDto[]; nextIndex: number };

export class ExerciseSessionService {
	#exerciseRepo: IExerciseRepository;
	#sessionRepo: ISessionRepository;
	#answerRepo: IAnswerRepository;

	constructor(
		exerciseRepo: IExerciseRepository,
		sessionRepo: ISessionRepository,
		answerRepo: IAnswerRepository,
	) {
		this.#exerciseRepo = exerciseRepo;
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

		const exercises = await this.#exerciseRepo.findRandom(
			tenses,
			mode === 'fixed' ? fixedLimit : MAX_EXERCISES,
		);
		const sessionId = crypto.randomUUID();
		const session = new Session(
			sessionId,
			tenses,
			mode,
			fixedLimit,
			'active',
			new Date().toISOString(),
		);
		await this.#sessionRepo.create(session);
		return { exercises, sessionId };
	}

	async saveAnswer(
		exercise: ExerciseResponseDto,
		userAnswer: string,
		sessionId: string,
		locale: Locale,
	): Promise<ExerciseAnswer> {
		const skipped = userAnswer.trim().length === 0;
		const answer = new ExerciseAnswer(
			crypto.randomUUID(),
			sessionId,
			exercise.id,
			userAnswer,
			skipped,
			skipped ? null : validateAnswer(userAnswer, exercise.answer),
			locale,
			new Date().toISOString(),
		);

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
		const more = await this.#exerciseRepo.findRandom(tenses, INFINITE_MODE_LIMIT);
		return { type: 'fetchMore', exercises: more, nextIndex: currentIndex + 1 };
	}
}
