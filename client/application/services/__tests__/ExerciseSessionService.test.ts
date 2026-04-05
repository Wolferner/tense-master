import { ExerciseAnswer } from '@/domain/entities/Answer';
import { Session } from '@/domain/entities/Session';
import { INFINITE_MODE_LIMIT, MAX_EXERCISES } from '@/shared/config/constants';
import type { ExerciseResponseDto } from '@/shared/dtos';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IAnswerRepository } from '../../repositories/IAnswerRepository';
import type { IExerciseRepository } from '../../repositories/IExerciseRepository';
import type { ISessionRepository } from '../../repositories/ISessionRepository';
import { ExerciseSessionService } from '../ExerciseSessionService';

const FIXED_UUID = 'aaaaaaaa-0000-0000-0000-000000000000';

function makeExercise(id = 'ex-1'): ExerciseResponseDto {
	return {
		id,
		tense: 'PRESENT_SIMPLE',
		question: 'Он читает',
		answer: 'He reads',
		explanation: 'habit',
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-01'),
	};
}

function makeExerciseRepo(overrides: Partial<IExerciseRepository> = {}): IExerciseRepository {
	return {
		findRandom: vi.fn().mockResolvedValue([makeExercise()]),
		findById: vi.fn(),
		findAll: vi.fn(),
		upsertMany: vi.fn(),
		...overrides,
	};
}

function makeSessionRepo(overrides: Partial<ISessionRepository> = {}): ISessionRepository {
	return {
		create: vi.fn(),
		updateStatus: vi.fn(),
		findAll: vi.fn(),
		findById: vi.fn(),
		findActive: vi.fn().mockResolvedValue([]),
		...overrides,
	};
}

function makeAnswerRepo(overrides: Partial<IAnswerRepository> = {}): IAnswerRepository {
	return {
		create: vi.fn(),
		findBySessionId: vi.fn(),
		findAll: vi.fn(),
		...overrides,
	};
}

function makeService(
	exerciseRepo = makeExerciseRepo(),
	sessionRepo = makeSessionRepo(),
	answerRepo = makeAnswerRepo(),
) {
	return new ExerciseSessionService(exerciseRepo, sessionRepo, answerRepo);
}

beforeEach(() => {
	vi.spyOn(crypto, 'randomUUID').mockReturnValue(
		FIXED_UUID as ReturnType<typeof crypto.randomUUID>,
	);
});

describe('ExerciseSessionService', () => {
	describe('beginSession', () => {
		it('completes all active sessions before starting a new one', async () => {
			const active = [
				new Session('old-1', ['PAST_SIMPLE'], 'fixed', 5, 'active', '2024-01-01T00:00:00.000Z'),
				new Session('old-2', ['PAST_SIMPLE'], 'fixed', 5, 'active', '2024-01-01T00:00:00.000Z'),
			];
			const sessionRepo = makeSessionRepo({ findActive: vi.fn().mockResolvedValue(active) });
			const service = makeService(makeExerciseRepo(), sessionRepo);

			await service.beginSession(['PRESENT_SIMPLE'], 'fixed', 5);

			expect(sessionRepo.updateStatus).toHaveBeenCalledWith(
				'old-1',
				'completed',
				expect.any(String),
			);
			expect(sessionRepo.updateStatus).toHaveBeenCalledWith(
				'old-2',
				'completed',
				expect.any(String),
			);
		});

		it('creates a new session and returns its id', async () => {
			const sessionRepo = makeSessionRepo();
			const service = makeService(makeExerciseRepo(), sessionRepo);

			const result = await service.beginSession(['PRESENT_SIMPLE'], 'fixed', 5);

			expect(sessionRepo.create).toHaveBeenCalledOnce();
			const created = vi.mocked(sessionRepo.create).mock.calls[0][0];
			expect(created).toBeInstanceOf(Session);
			expect(created.id).toBe(FIXED_UUID);
			expect(created.tenses).toEqual(['PRESENT_SIMPLE']);
			expect(created.mode).toBe('fixed');
			expect(created.status).toBe('active');
			expect(result.sessionId).toBe(FIXED_UUID);
		});

		it('requests fixedLimit exercises in fixed mode', async () => {
			const exerciseRepo = makeExerciseRepo();
			const service = makeService(exerciseRepo);

			await service.beginSession(['PAST_SIMPLE'], 'fixed', 10);

			expect(exerciseRepo.findRandom).toHaveBeenCalledWith(['PAST_SIMPLE'], 10);
		});

		it('requests MAX_EXERCISES in infinite mode', async () => {
			const exerciseRepo = makeExerciseRepo();
			const service = makeService(exerciseRepo);

			await service.beginSession(['PAST_SIMPLE'], 'infinite', 5);

			expect(exerciseRepo.findRandom).toHaveBeenCalledWith(['PAST_SIMPLE'], MAX_EXERCISES);
		});
	});

	describe('saveAnswer', () => {
		it('marks answer as skipped when userAnswer is empty', async () => {
			const answerRepo = makeAnswerRepo();
			const service = makeService(makeExerciseRepo(), makeSessionRepo(), answerRepo);

			const answer = await service.saveAnswer(makeExercise(), '', 'session-1');

			expect(answer.skipped).toBe(true);
			expect(answer.isCorrect).toBeNull();
		});

		it('marks answer as skipped when userAnswer is whitespace only', async () => {
			const service = makeService();
			const answer = await service.saveAnswer(makeExercise(), '   ', 'session-1');

			expect(answer.skipped).toBe(true);
			expect(answer.isCorrect).toBeNull();
		});

		it('validates answer correctly when not skipped', async () => {
			const service = makeService();
			const exercise = makeExercise();

			const correct = await service.saveAnswer(exercise, 'He reads', 'session-1');
			const wrong = await service.saveAnswer(exercise, 'He read', 'session-1');

			expect(correct.isCorrect).toBe(true);
			expect(wrong.isCorrect).toBe(false);
		});

		it('returns ExerciseAnswer with correct fields', async () => {
			const service = makeService();
			const exercise = makeExercise('ex-42');

			const answer = await service.saveAnswer(exercise, 'He reads', 'session-abc');

			expect(answer).toBeInstanceOf(ExerciseAnswer);
			expect(answer.id).toBe(FIXED_UUID);
			expect(answer.sessionId).toBe('session-abc');
			expect(answer.exerciseId).toBe('ex-42');
			expect(answer.userAnswer).toBe('He reads');
		});
	});

	describe('resolveNext', () => {
		const exercises = [makeExercise('e0'), makeExercise('e1'), makeExercise('e2')];

		it('advances index when more exercises remain', async () => {
			const service = makeService();
			const result = await service.resolveNext(0, exercises, ['PRESENT_SIMPLE'], 'fixed');
			expect(result).toEqual({ type: 'advance', nextIndex: 1 });
		});

		it('returns complete in fixed mode when at last exercise', async () => {
			const service = makeService();
			const result = await service.resolveNext(2, exercises, ['PRESENT_SIMPLE'], 'fixed');
			expect(result).toEqual({ type: 'complete' });
		});

		it('fetches more exercises in infinite mode when at last exercise', async () => {
			const more = [makeExercise('new-1'), makeExercise('new-2')];
			const exerciseRepo = makeExerciseRepo({ findRandom: vi.fn().mockResolvedValue(more) });
			const service = makeService(exerciseRepo);

			const result = await service.resolveNext(2, exercises, ['PRESENT_SIMPLE'], 'infinite');

			expect(result).toEqual({ type: 'fetchMore', exercises: more, nextIndex: 3 });
			expect(exerciseRepo.findRandom).toHaveBeenCalledWith(['PRESENT_SIMPLE'], INFINITE_MODE_LIMIT);
		});
	});
});
