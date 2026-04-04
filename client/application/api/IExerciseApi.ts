import { ExerciseResponseDto } from '@/shared/dtos';

export interface IExerciseApi {
	getMeta(): Promise<{ lastUpdatedAt: string | null }>;
	getAll(): Promise<ExerciseResponseDto[]>;
}
