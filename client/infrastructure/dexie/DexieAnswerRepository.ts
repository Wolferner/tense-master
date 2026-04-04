import type { IAnswerRepository } from '@/client/application/repositories/IAnswerRepository';
import type { ExerciseAnswer } from '@/domain/entities/Answer';
import type { TenseMasterDb } from './db';

export class DexieAnswerRepository implements IAnswerRepository {
	constructor(private readonly db: TenseMasterDb) {}

	async create(answer: ExerciseAnswer): Promise<void> {
		await this.db.answers.put(answer);
	}

	async findBySessionId(sessionId: string): Promise<ExerciseAnswer[]> {
		return this.db.answers.where('sessionId').equals(sessionId).toArray();
	}

	async findAll(): Promise<ExerciseAnswer[]> {
		return this.db.answers.orderBy('createdAt').toArray();
	}
}
