import { Tense } from '../../../../domain/value-objects';

export interface ExerciseResponseDto {
	id: string;
	tense: Tense;
	question: string;
	answer: string;
	explanation: string;
	createdAt: Date;
	updatedAt: Date;
}
