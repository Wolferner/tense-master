import { type TenseType } from '@/domain/value-objects';
import { type ExerciseResponseDto } from '@/server/application/exercise';

export interface IExerciseApiRepository {
	findRandom(tenses: TenseType[], limit: number): Promise<ExerciseResponseDto[]>;
}
