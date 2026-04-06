import { IExerciseApi } from '@/client/application/api/IExerciseApi';
import { API_ROUTES } from '@/shared/config/routes';
import { ExerciseResponseDto } from '@/shared/dtos';

export class ExerciseApi implements IExerciseApi {
	async getMeta(): Promise<{ lastUpdatedAt: string | null }> {
		return fetch(API_ROUTES.exercises.meta).then(r => r.json());
	}

	async getAll(): Promise<ExerciseResponseDto[]> {
		return fetch(API_ROUTES.exercises.all).then(r => r.json());
	}
}
