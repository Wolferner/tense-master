import { ExerciseAnswer } from '@/domain/entities/Answer';
import { Session } from '@/domain/entities/Session';
import type { TenseType } from '@/domain/value-objects';
import type { ExerciseResponseDto } from '@/shared/dtos';
import { describe, expect, it, vi } from 'vitest';
import type { IAnswerRepository } from '../../repositories/IAnswerRepository';
import type { IExerciseRepository } from '../../repositories/IExerciseRepository';
import type { ISessionRepository } from '../../repositories/ISessionRepository';
import { ProfileService } from '../ProfileService';

function makeSession(id: string, tenses: TenseType[], createdAt: string): Session {
	return new Session(id, tenses, 'fixed', 5, 'completed', createdAt, createdAt);
}

function makeAnswer(
	id: string,
	sessionId: string,
	exerciseId: string,
	skipped: boolean,
	isCorrect: boolean | null,
): ExerciseAnswer {
	return new ExerciseAnswer(
		id,
		sessionId,
		exerciseId,
		'user answer',
		skipped,
		isCorrect,
		'ru',
		'2024-01-01T00:00:00.000Z',
	);
}

function makeExercise(id: string, tense: TenseType): ExerciseResponseDto {
	return {
		id,
		tense,
		question: 'Q',
		answer: 'A',
		locale: 'ru',
		explanation: 'E',
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-01'),
	};
}

function makeRepos({
	sessions = [] as Session[],
	answers = [] as ExerciseAnswer[],
	exercises = [] as ExerciseResponseDto[],
} = {}) {
	const sessionRepo: ISessionRepository = {
		create: vi.fn(),
		updateStatus: vi.fn(),
		findAll: vi.fn().mockResolvedValue(sessions),
		findById: vi.fn(),
		findActive: vi.fn(),
	};
	const answerRepo: IAnswerRepository = {
		create: vi.fn(),
		findBySessionId: vi.fn(),
		findAll: vi.fn().mockResolvedValue(answers),
	};
	const exerciseRepo: IExerciseRepository = {
		findRandom: vi.fn(),
		findById: vi.fn(),
		findAll: vi.fn().mockResolvedValue(exercises),
		upsertMany: vi.fn(),
	};
	return { sessionRepo, answerRepo, exerciseRepo };
}

describe('ProfileService', () => {
	describe('getProfileStats — overallStats', () => {
		it('returns zeros when there are no answers', async () => {
			const { sessionRepo, answerRepo, exerciseRepo } = makeRepos();
			const service = new ProfileService(sessionRepo, answerRepo, exerciseRepo);

			const { overallStats } = await service.getProfileStats();

			expect(overallStats).toEqual({ total: 0, correct: 0, skipped: 0, accuracy: 0 });
		});

		it('calculates accuracy excluding skipped answers', async () => {
			const answers = [
				makeAnswer('a1', 's1', 'e1', false, true),
				makeAnswer('a2', 's1', 'e2', false, false),
				makeAnswer('a3', 's1', 'e3', true, null),
			];
			const { sessionRepo, answerRepo, exerciseRepo } = makeRepos({ answers });
			const service = new ProfileService(sessionRepo, answerRepo, exerciseRepo);

			const { overallStats } = await service.getProfileStats();

			expect(overallStats.total).toBe(3);
			expect(overallStats.correct).toBe(1);
			expect(overallStats.skipped).toBe(1);
			expect(overallStats.accuracy).toBe(50); // 1 correct out of 2 attempted
		});

		it('returns 0 accuracy when all answers are skipped', async () => {
			const answers = [makeAnswer('a1', 's1', 'e1', true, null)];
			const { sessionRepo, answerRepo, exerciseRepo } = makeRepos({ answers });
			const service = new ProfileService(sessionRepo, answerRepo, exerciseRepo);

			const { overallStats } = await service.getProfileStats();

			expect(overallStats.accuracy).toBe(0);
		});
	});

	describe('getProfileStats — tenseStats', () => {
		it('groups answers by tense', async () => {
			const exercises = [
				makeExercise('e1', 'PRESENT_SIMPLE'),
				makeExercise('e2', 'PAST_SIMPLE'),
				makeExercise('e3', 'PRESENT_SIMPLE'),
			];
			const answers = [
				makeAnswer('a1', 's1', 'e1', false, true),
				makeAnswer('a2', 's1', 'e2', false, false),
				makeAnswer('a3', 's1', 'e3', false, true),
			];
			const { sessionRepo, answerRepo, exerciseRepo } = makeRepos({ answers, exercises });
			const service = new ProfileService(sessionRepo, answerRepo, exerciseRepo);

			const { tenseStats } = await service.getProfileStats();

			const ps = tenseStats.find(t => t.tense === 'PRESENT_SIMPLE')!;
			const past = tenseStats.find(t => t.tense === 'PAST_SIMPLE')!;
			expect(ps.total).toBe(2);
			expect(ps.correct).toBe(2);
			expect(ps.accuracy).toBe(100);
			expect(past.total).toBe(1);
			expect(past.correct).toBe(0);
			expect(past.accuracy).toBe(0);
		});

		it('skips answers whose exercise is not found', async () => {
			const answers = [makeAnswer('a1', 's1', 'unknown-exercise', false, true)];
			const { sessionRepo, answerRepo, exerciseRepo } = makeRepos({ answers, exercises: [] });
			const service = new ProfileService(sessionRepo, answerRepo, exerciseRepo);

			const { tenseStats } = await service.getProfileStats();

			expect(tenseStats).toHaveLength(0);
		});
	});

	describe('getProfileStats — sessionSummaries', () => {
		it('returns sessions sorted newest first', async () => {
			const sessions = [
				makeSession('s1', ['PAST_SIMPLE'], '2024-01-01T00:00:00.000Z'),
				makeSession('s2', ['PRESENT_SIMPLE'], '2024-03-01T00:00:00.000Z'),
			];
			const { sessionRepo, answerRepo, exerciseRepo } = makeRepos({ sessions });
			const service = new ProfileService(sessionRepo, answerRepo, exerciseRepo);

			const { sessionSummaries } = await service.getProfileStats();

			expect(sessionSummaries[0].session.id).toBe('s2');
			expect(sessionSummaries[1].session.id).toBe('s1');
		});

		it('calculates per-session stats correctly', async () => {
			const sessions = [makeSession('s1', ['PRESENT_SIMPLE'], '2024-01-01T00:00:00.000Z')];
			const answers = [
				makeAnswer('a1', 's1', 'e1', false, true),
				makeAnswer('a2', 's1', 'e2', false, false),
				makeAnswer('a3', 's1', 'e3', true, null),
				makeAnswer('a4', 's2', 'e4', false, true), // different session
			];
			const { sessionRepo, answerRepo, exerciseRepo } = makeRepos({ sessions, answers });
			const service = new ProfileService(sessionRepo, answerRepo, exerciseRepo);

			const { sessionSummaries } = await service.getProfileStats();

			const s1 = sessionSummaries[0];
			expect(s1.total).toBe(3);
			expect(s1.correct).toBe(1);
			expect(s1.skipped).toBe(1);
			expect(s1.accuracy).toBe(50);
		});
	});

	describe('getProfileStats — chartData', () => {
		it('returns chart data in chronological order with cumulative correct', async () => {
			const sessions = [
				makeSession('s1', ['PRESENT_SIMPLE'], '2024-02-01T00:00:00.000Z'),
				makeSession('s2', ['PAST_SIMPLE'], '2024-01-01T00:00:00.000Z'),
			];
			const answers = [
				makeAnswer('a1', 's1', 'e1', false, true),
				makeAnswer('a2', 's1', 'e2', false, true),
				makeAnswer('a3', 's2', 'e3', false, true),
			];
			const { sessionRepo, answerRepo, exerciseRepo } = makeRepos({ sessions, answers });
			const service = new ProfileService(sessionRepo, answerRepo, exerciseRepo);

			const { chartData } = await service.getProfileStats();

			expect(chartData).toHaveLength(2);
			// s2 (Jan) comes first chronologically
			expect(chartData[0].sessionCorrect).toBe(1);
			expect(chartData[0].cumulative).toBe(1);
			expect(chartData[0].tenses).toEqual(['PAST_SIMPLE']);
			// s1 (Feb) is second
			expect(chartData[1].sessionCorrect).toBe(2);
			expect(chartData[1].cumulative).toBe(3);
		});

		it('cumulative stays 0 when all answers are skipped', async () => {
			const sessions = [makeSession('s1', ['PRESENT_SIMPLE'], '2024-01-01T00:00:00.000Z')];
			const answers = [makeAnswer('a1', 's1', 'e1', true, null)];
			const { sessionRepo, answerRepo, exerciseRepo } = makeRepos({ sessions, answers });
			const service = new ProfileService(sessionRepo, answerRepo, exerciseRepo);

			const { chartData } = await service.getProfileStats();

			expect(chartData[0].cumulative).toBe(0);
		});
	});

	describe('getProfileStats — getSessionAnswers', () => {
		it('returns only answers for the given sessionId', async () => {
			const exercises = [makeExercise('e1', 'PRESENT_SIMPLE'), makeExercise('e2', 'PAST_SIMPLE')];
			const answers = [
				makeAnswer('a1', 's1', 'e1', false, true),
				makeAnswer('a2', 's2', 'e2', false, false),
			];
			const { sessionRepo, answerRepo, exerciseRepo } = makeRepos({ answers, exercises });
			const service = new ProfileService(sessionRepo, answerRepo, exerciseRepo);

			const { getSessionAnswers } = await service.getProfileStats();
			const result = getSessionAnswers('s1');

			expect(result).toHaveLength(1);
			expect(result[0].id).toBe('a1');
			expect(result[0].exercise.id).toBe('e1');
		});
	});
});
