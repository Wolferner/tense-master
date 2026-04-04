import { type Tense } from '@/domain/value-objects';

export interface CreateExerciseDto {
	tense: Tense;
	question: string;
	answer: string;
	explanation: string;
}
