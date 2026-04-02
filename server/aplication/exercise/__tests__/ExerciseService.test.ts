import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExerciseService } from '../ExerciseService';
import { IExerciseRepository } from '../../../domain/repositories';
import { Exercise } from '../../../domain/entities/Exercise';
import { Tense } from '../../../domain/value-objects';
import { MAX_EXERCISES } from '@/shared/config/constants';

function makeExercise(): Exercise {
	return new Exercise(
		Tense.PRESENT_SIMPLE,
		'Он читает книгу',
		'He reads a book',
		'Present Simple for habits',
		'test-id',
		new Date('2024-01-01'),
		new Date('2024-01-01'),
	);
}

function makeRepo(overrides: Partial<IExerciseRepository> = {}): IExerciseRepository {
	return {
		create: vi.fn(),
		findById: vi.fn(),
		findByTenses: vi.fn(),
		findRandom: vi.fn(),
		...overrides,
	};
}

describe('ExerciseService', () => {
	describe('findRandom', () => {
		it('returns [] when tenses is empty', async () => {
			const service = new ExerciseService(makeRepo());
			const result = await service.findRandom([], 5);
			expect(result).toEqual([]);
		});

		it('throws when limit is negative', async () => {
			const service = new ExerciseService(makeRepo());
			await expect(service.findRandom([Tense.PAST_SIMPLE], -1)).rejects.toThrow();
		});

		it(`throws when limit exceeds MAX_EXERCISES (${MAX_EXERCISES})`, async () => {
			const service = new ExerciseService(makeRepo());
			await expect(service.findRandom([Tense.PAST_SIMPLE], MAX_EXERCISES + 1)).rejects.toThrow();
		});

		it('returns [] when repo returns no exercises', async () => {
			const repo = makeRepo({ findRandom: vi.fn().mockResolvedValue([]) });
			const service = new ExerciseService(repo);
			const result = await service.findRandom([Tense.PAST_SIMPLE], 5);
			expect(result).toEqual([]);
		});

		it('repeats exercises to fill limit when repo returns fewer than requested', async () => {
			const exercises = [makeExercise(), makeExercise()];
			const repo = makeRepo({ findRandom: vi.fn().mockResolvedValue(exercises) });
			const service = new ExerciseService(repo);
			const result = await service.findRandom([Tense.PAST_SIMPLE], 5);
			expect(result).toHaveLength(5);
		});

		it('returns exercises mapped to DTO when repo returns enough', async () => {
			const exercises = Array.from({ length: 5 }, () => makeExercise());
			const repo = makeRepo({ findRandom: vi.fn().mockResolvedValue(exercises) });
			const service = new ExerciseService(repo);
			const result = await service.findRandom([Tense.PAST_SIMPLE], 5);
			expect(result).toHaveLength(5);
			expect(result[0]).toMatchObject({
				id: 'test-id',
				tense: Tense.PRESENT_SIMPLE,
				question: 'Он читает книгу',
				answer: 'He reads a book',
				explanation: 'Present Simple for habits',
			});
		});

		it('does not repeat when repo returns exactly the requested limit', async () => {
			const exercises = Array.from({ length: 3 }, () => makeExercise());
			const repo = makeRepo({ findRandom: vi.fn().mockResolvedValue(exercises) });
			const service = new ExerciseService(repo);
			const result = await service.findRandom([Tense.PAST_SIMPLE], 3);
			expect(result).toHaveLength(3);
		});
	});

	describe('create', () => {
		it('calls repo.create and returns mapped DTO', async () => {
			const exercise = makeExercise();
			const repo = makeRepo({ create: vi.fn().mockResolvedValue(exercise) });
			const service = new ExerciseService(repo);
			const result = await service.create({
				tense: Tense.PRESENT_SIMPLE,
				question: 'Он читает книгу',
				answer: 'He reads a book',
				explanation: 'Present Simple for habits',
			});
			expect(repo.create).toHaveBeenCalledOnce();
			expect(result).toMatchObject({
				tense: Tense.PRESENT_SIMPLE,
				question: 'Он читает книгу',
				answer: 'He reads a book',
			});
		});
	});
});
