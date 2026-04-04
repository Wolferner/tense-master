import { type TenseType } from '@/domain/value-objects';
import { type ExerciseResponseDto } from '@/shared/dtos';

export interface IExerciseApiRepository {
	findRandom(tenses: TenseType[], limit: number): Promise<ExerciseResponseDto[]>;
}
