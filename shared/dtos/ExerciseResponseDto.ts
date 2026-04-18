import { type Locale, type Tense } from '@/domain/value-objects';

export interface ExerciseResponseDto {
	id: string;
	tense: Tense;
	locale: Locale;
	question: string;
	answer: string;
	explanation: string;
	createdAt: Date;
	updatedAt: Date;
}
