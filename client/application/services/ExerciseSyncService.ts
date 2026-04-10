import type { IExerciseRepository } from '@/client/application/repositories/IExerciseRepository';
import type { ExerciseResponseDto } from '@/shared/dtos';
import type { IExerciseApi } from '../api/IExerciseApi';

export class ExerciseSyncService {
	constructor(
		private readonly local: IExerciseRepository,
		private readonly exerciseApi: IExerciseApi,
	) {}

	async sync(locale: string): Promise<void> {
		try {
			const lastSyncedKey = `tense-last-synced-${locale}`;
			const meta: { lastUpdatedAt: string | null } = await this.exerciseApi.getMeta(locale);
			if (!meta.lastUpdatedAt) return;

			const lastSynced = localStorage.getItem(lastSyncedKey);
			if (lastSynced === meta.lastUpdatedAt) return;

			const exercises: ExerciseResponseDto[] = await this.exerciseApi.getAll(locale);
			await this.local.upsertMany(exercises);
			localStorage.setItem(lastSyncedKey, meta.lastUpdatedAt);
		} catch {
			// offline or server error — use existing local data
		}
	}
}
