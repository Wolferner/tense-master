import type { IExerciseLocalRepository } from '@/client/application/repositories/IExerciseLocalRepository';
import type { ExerciseResponseDto } from '@/shared/dtos';

const LAST_SYNCED_KEY = 'tense-last-synced';

export class ExerciseSyncService {
	constructor(private readonly local: IExerciseLocalRepository) {}

	async sync(): Promise<void> {
		try {
			const meta: { lastUpdatedAt: string | null } = await fetch('/api/exercises/meta').then(r =>
				r.json(),
			);
			if (!meta.lastUpdatedAt) return;

			const lastSynced = localStorage.getItem(LAST_SYNCED_KEY);
			if (lastSynced === meta.lastUpdatedAt) return;

			const exercises: ExerciseResponseDto[] = await fetch('/api/exercises/all').then(r =>
				r.json(),
			);
			await this.local.upsertMany(exercises);
			localStorage.setItem(LAST_SYNCED_KEY, meta.lastUpdatedAt);
		} catch {
			// offline or server error — use existing local data
		}
	}
}
