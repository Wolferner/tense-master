import type { TenseType } from '@/domain/value-objects';
import type { ExerciseResponseDto } from '@/shared/dtos';

export interface IExerciseRepository {
	findRandom(tenses: TenseType[], limit: number): Promise<ExerciseResponseDto[]>;
	findById(id: string): Promise<ExerciseResponseDto | undefined>;
	findAll(): Promise<ExerciseResponseDto[]>;
	upsertMany(exercises: ExerciseResponseDto[]): Promise<void>;
}
