import type { IExerciseRepository } from '@/client/application/repositories/IExerciseRepository';
import type { ExerciseResponseDto } from '@/shared/dtos';
import type { IExerciseApi } from '../api/IExerciseApi';

const LAST_SYNCED_KEY = 'tense-last-synced';

export class ExerciseSyncService {
	constructor(
		private readonly local: IExerciseRepository,
		private readonly exerciseApi: IExerciseApi,
	) {}

	async sync(): Promise<void> {
		try {
			const meta: { lastUpdatedAt: string | null } = await this.exerciseApi.getMeta();
			if (!meta.lastUpdatedAt) return;

			const lastSynced = localStorage.getItem(LAST_SYNCED_KEY);
			if (lastSynced === meta.lastUpdatedAt) return;

			const exercises: ExerciseResponseDto[] = await this.exerciseApi.getAll();
			await this.local.upsertMany(exercises);
			localStorage.setItem(LAST_SYNCED_KEY, meta.lastUpdatedAt);
		} catch {
			// offline or server error — use existing local data
		}
	}
}
