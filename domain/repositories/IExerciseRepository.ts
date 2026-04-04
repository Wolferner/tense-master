import { Exercise } from '../entities/Exercise';
import { Tense } from '../value-objects';

interface CreateExerciseDb {
	tense: Tense;
	question: string;
	answer: string;
	explanation: string;
}

export interface IExerciseRepository {
	create(data: CreateExerciseDb): Promise<Exercise>;
	findById(id: Exercise['id']): Promise<Exercise | null>;
	findByTenses(tenses: Tense[]): Promise<Exercise[]>;
	findRandom(tenses: Tense[], limit: number): Promise<Exercise[]>;
	findLatestUpdatedAt(): Promise<Date | null>;
	findAll(): Promise<Exercise[]>;
}
