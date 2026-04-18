import { Exercise } from '../../../domain/entities/Exercise';
import { Locale, Tense } from '../../../domain/value-objects';

export interface CreateExerciseDb {
	tense: Tense;
	answer: string;
	translations: {
		locale: Locale;
		question: string;
		explanation: string;
	}[];
}

export interface IExerciseRepository {
	create(data: CreateExerciseDb): Promise<void>;
	findById(id: Exercise['id'], locale: Locale): Promise<Exercise | null>;
	findByTenses(tenses: Tense[], locale: Locale): Promise<Exercise[]>;
	findRandom(tenses: Tense[], limit: number, locale: Locale): Promise<Exercise[]>;
	findLatestUpdatedAt(locale: Locale): Promise<Date | null>;
	findAll(locale: Locale): Promise<Exercise[]>;
}
