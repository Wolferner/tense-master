import { IExerciseApi } from '@/client/application/api/IExerciseApi';
import { API_ROUTES } from '@/shared/config/routes';
import { ExerciseResponseDto } from '@/shared/dtos';

export class ExerciseApi implements IExerciseApi {
	async getMeta(locale: string): Promise<{ lastUpdatedAt: string | null }> {
		return fetch(`${API_ROUTES.exercises.meta}?locale=${locale}`).then(r => r.json());
	}

	async getAll(locale: string): Promise<ExerciseResponseDto[]> {
		return fetch(`${API_ROUTES.exercises.all}?locale=${locale}`).then(r => r.json());
	}
}
