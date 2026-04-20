import { MAX_EXERCISES } from '@/shared/config/constants';
import { CreateExerciseDto } from '@/shared/dtos/CreateExerciseDto';
import { describe, expect, it, vi } from 'vitest';
import { Exercise } from '../../../../domain/entities/Exercise';
import { Tense } from '../../../../domain/value-objects';
import { IExerciseRepository } from '../../repositories';
import { ExerciseService } from '../ExerciseService';

function makeExercise(id: string): Exercise {
	return new Exercise(
		Tense.PRESENT_SIMPLE,
		'Он читает книгу',
		'He reads a book',
		'Present Simple for habits',
		id,
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
		findAll: vi.fn(),
		findLatestUpdatedAt: vi.fn(),
		...overrides,
	};
}

describe('ExerciseService', () => {
	describe('findRandom', () => {
		it('returns [] when tenses is empty', async () => {
			const service = new ExerciseService(makeRepo());
			const result = await service.findRandom([], 5, 'ru');
			expect(result).toEqual([]);
		});

		it('throws when limit is negative', async () => {
			const service = new ExerciseService(makeRepo());
			await expect(service.findRandom([Tense.PAST_SIMPLE], -1, 'ru')).rejects.toThrow(
				`Limit must be between 1 and ${MAX_EXERCISES}`,
			);
		});

		it(`throws when limit exceeds MAX_EXERCISES (${MAX_EXERCISES})`, async () => {
			const service = new ExerciseService(makeRepo());
			await expect(
				service.findRandom([Tense.PAST_SIMPLE], MAX_EXERCISES + 1, 'ru'),
			).rejects.toThrow(`Limit must be between 1 and ${MAX_EXERCISES}`);
		});

		it('returns [] when repo returns no exercises', async () => {
			const repo = makeRepo({ findRandom: vi.fn().mockResolvedValue([]) });
			const service = new ExerciseService(repo);
			const result = await service.findRandom([Tense.PAST_SIMPLE], 5, 'ru');
			expect(result).toEqual([]);
		});

		it('cycles exercises in order to fill limit when repo returns fewer than requested', async () => {
			const exercises = [makeExercise('id-0'), makeExercise('id-1')];
			const repo = makeRepo({ findRandom: vi.fn().mockResolvedValue(exercises) });
			const service = new ExerciseService(repo);
			const result = await service.findRandom([Tense.PAST_SIMPLE], 5, 'ru');
			expect(result).toHaveLength(5);
			expect(result.map(e => e.id)).toEqual(['id-0', 'id-1', 'id-0', 'id-1', 'id-0']);
		});

		it('returns exercises mapped to DTO when repo returns enough', async () => {
			const exercises = Array.from({ length: 5 }, (_, i) => makeExercise(`id-${i}`));
			const repo = makeRepo({ findRandom: vi.fn().mockResolvedValue(exercises) });
			const service = new ExerciseService(repo);
			const result = await service.findRandom([Tense.PAST_SIMPLE], 5, 'ru');
			expect(result).toHaveLength(5);
			expect(result[0]).toMatchObject({
				id: 'id-0',
				tense: Tense.PRESENT_SIMPLE,
				question: 'Он читает книгу',
				answer: 'He reads a book',
				explanation: 'Present Simple for habits',
			});
		});

		it('does not repeat when repo returns exactly the requested limit', async () => {
			const exercises = Array.from({ length: 3 }, (_, i) => makeExercise(`id-${i}`));
			const repo = makeRepo({ findRandom: vi.fn().mockResolvedValue(exercises) });
			const service = new ExerciseService(repo);
			const result = await service.findRandom([Tense.PAST_SIMPLE], 3, 'ru');
			expect(result.map(e => e.id)).toEqual(['id-0', 'id-1', 'id-2']);
		});
	});

	describe('create', () => {
		it('passes correct data to repo.create and returns mapped DTO', async () => {
			const exercise = makeExercise('created-id');
			const repo = makeRepo({ create: vi.fn().mockResolvedValue(exercise) });
			const service = new ExerciseService(repo);
			const dto: CreateExerciseDto = {
				tense: Tense.PRESENT_SIMPLE,
				answer: 'He reads a book',
				translations: [
					{
						locale: 'ru',
						question: 'Он читает книгу',
						explanation: 'Present Simple для привычек',
					},
				],
			};
			const result = await service.create(dto);
			expect(repo.create).toHaveBeenCalledOnce();
			const passedArg = vi.mocked(repo.create).mock.calls[0][0];
			expect(passedArg).toMatchObject({
				tense: dto.tense,

				answer: dto.answer,
				translations: [
					{
						locale: 'ru',
						question: 'Он читает книгу',
						explanation: 'Present Simple для привычек',
					},
				],
			});
		});
	});
});
