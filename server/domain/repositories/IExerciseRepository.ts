import { Exercise } from '../entities/Exercise';
import { Tense } from '../value-objects';

export interface IExerciseRepository {
	findById(id: Exercise['id']): Promise<Exercise | null>;
	findByTenses(tenses: Tense[]): Promise<Exercise[]>;
	findRandom(tenses: Tense[], limit: number): Promise<Exercise[]>;
}
