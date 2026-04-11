import { Locale, type Tense } from '@/domain/value-objects';

export interface CreateExerciseDto {
	tense: Tense;
	answer: string;
	translations: {
		locale: Locale;
		question: string;
		explanation: string;
	}[];
}
