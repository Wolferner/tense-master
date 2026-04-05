import { IExerciseApi } from '@/client/application/api/IExerciseApi';
import { ExerciseResponseDto } from '@/shared/dtos';

export class ExerciseApi implements IExerciseApi {
	async getMeta(): Promise<{ lastUpdatedAt: string | null }> {
		return fetch('/api/exercises/meta').then(r => r.json());
	}

	async getAll(): Promise<ExerciseResponseDto[]> {
		return fetch('/api/exercises/all').then(r => r.json());
	}
}
