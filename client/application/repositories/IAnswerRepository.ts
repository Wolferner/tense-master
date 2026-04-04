import type { ExerciseAnswer } from '@/domain/entities/Answer';

export interface IAnswerRepository {
	create(answer: ExerciseAnswer): Promise<void>;
	findBySessionId(sessionId: string): Promise<ExerciseAnswer[]>;
	findAll(): Promise<ExerciseAnswer[]>;
}
