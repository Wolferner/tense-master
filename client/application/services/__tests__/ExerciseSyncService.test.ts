import type { ExerciseResponseDto } from '@/shared/dtos';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IExerciseApi } from '../../api/IExerciseApi';
import type { IExerciseRepository } from '../../repositories/IExerciseRepository';
import { ExerciseSyncService } from '../ExerciseSyncService';

const LAST_SYNCED_KEY = 'tense-last-synced-ru';

function makeExercise(id = 'ex-1'): ExerciseResponseDto {
	return {
		id,
		tense: 'PRESENT_SIMPLE',
		question: 'Он читает',
		answer: 'He reads',
		locale: 'ru',
		explanation: 'habit',
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-01'),
	};
}

function makeLocalRepo(overrides: Partial<IExerciseRepository> = {}): IExerciseRepository {
	return {
		findRandom: vi.fn(),
		findById: vi.fn(),
		findAll: vi.fn(),
		upsertMany: vi.fn(),
		...overrides,
	};
}

function makeApi(overrides: Partial<IExerciseApi> = {}): IExerciseApi {
	return {
		getMeta: vi.fn().mockResolvedValue({ lastUpdatedAt: '2024-06-01T00:00:00.000Z' }),
		getAll: vi.fn().mockResolvedValue([makeExercise()]),
		...overrides,
	};
}

beforeEach(() => {
	localStorage.clear();
});

describe('ExerciseSyncService', () => {
	it('does nothing when meta.lastUpdatedAt is null', async () => {
		const local = makeLocalRepo();
		const api = makeApi({ getMeta: vi.fn().mockResolvedValue({ lastUpdatedAt: null }) });
		const service = new ExerciseSyncService(local, api);

		await service.sync('ru');

		expect(api.getAll).not.toHaveBeenCalled();
		expect(local.upsertMany).not.toHaveBeenCalled();
	});

	it('skips sync when lastSynced matches meta.lastUpdatedAt', async () => {
		const lastUpdatedAt = '2024-06-01T00:00:00.000Z';
		localStorage.setItem(LAST_SYNCED_KEY, lastUpdatedAt);
		const local = makeLocalRepo();
		const api = makeApi({ getMeta: vi.fn().mockResolvedValue({ lastUpdatedAt }) });
		const service = new ExerciseSyncService(local, api);

		await service.sync('ru');

		expect(api.getAll).not.toHaveBeenCalled();
		expect(local.upsertMany).not.toHaveBeenCalled();
	});

	it('upserts exercises when lastUpdatedAt differs from lastSynced', async () => {
		const lastUpdatedAt = '2024-06-01T00:00:00.000Z';
		localStorage.setItem(LAST_SYNCED_KEY, '2024-01-01T00:00:00.000Z');
		const exercises = [makeExercise('a'), makeExercise('b')];
		const local = makeLocalRepo();
		const api = makeApi({
			getMeta: vi.fn().mockResolvedValue({ lastUpdatedAt }),
			getAll: vi.fn().mockResolvedValue(exercises),
		});
		const service = new ExerciseSyncService(local, api);

		await service.sync('ru');

		expect(local.upsertMany).toHaveBeenCalledWith(exercises);
		expect(localStorage.getItem(LAST_SYNCED_KEY)).toBe(lastUpdatedAt);
	});

	it('upserts exercises when there is no lastSynced entry', async () => {
		const lastUpdatedAt = '2024-06-01T00:00:00.000Z';
		const exercises = [makeExercise()];
		const local = makeLocalRepo();
		const api = makeApi({
			getMeta: vi.fn().mockResolvedValue({ lastUpdatedAt }),
			getAll: vi.fn().mockResolvedValue(exercises),
		});
		const service = new ExerciseSyncService(local, api);

		await service.sync('ru');

		expect(local.upsertMany).toHaveBeenCalledWith(exercises);
		expect(localStorage.getItem(LAST_SYNCED_KEY)).toBe(lastUpdatedAt);
	});

	it('silently swallows errors (offline / server error)', async () => {
		const local = makeLocalRepo();
		const api = makeApi({ getMeta: vi.fn().mockRejectedValue(new Error('Network error')) });
		const service = new ExerciseSyncService(local, api);

		await expect(service.sync('ru')).resolves.toBeUndefined();
		expect(local.upsertMany).not.toHaveBeenCalled();
	});
});
