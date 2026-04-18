import { ExerciseResponseDto } from '@/shared/dtos';

export interface IExerciseApi {
	getMeta(locale: string): Promise<{ lastUpdatedAt: string | null }>;
	getAll(locale: string): Promise<ExerciseResponseDto[]>;
}
