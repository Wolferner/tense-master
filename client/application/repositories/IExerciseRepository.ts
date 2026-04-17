import type { LocaleType, TenseType } from '@/domain/value-objects';
import type { ExerciseResponseDto } from '@/shared/dtos';

export interface IExerciseRepository {
	findRandom(
		tenses: TenseType[],
		limit: number,
		locale: LocaleType,
	): Promise<ExerciseResponseDto[]>;
	findById(id: string): Promise<ExerciseResponseDto | undefined>;
	findAll(): Promise<ExerciseResponseDto[]>;
	upsertMany(exercises: ExerciseResponseDto[]): Promise<void>;
}
