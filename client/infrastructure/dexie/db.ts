import Dexie, { type Table } from 'dexie';
import type { ExerciseAnswer } from '@/domain/entities/Answer';
import type { Session } from '@/domain/entities/Session';
import type { ExerciseResponseDto } from '@/shared/dtos';

export class TenseMasterDb extends Dexie {
	exercises!: Table<ExerciseResponseDto>;
	sessions!: Table<Session>;
	answers!: Table<ExerciseAnswer>;

	constructor() {
		super('tense-master');
		this.version(1).stores({
			exercises: 'id, tense, updatedAt',
			sessions: 'id, status, createdAt',
			answers: 'id, sessionId, exerciseId, createdAt',
		});
		this.version(2).stores({
			exercises: 'id, tense, updatedAt',
			sessions: 'id, status, createdAt',
			answers: 'id, sessionId, exerciseId, locale, createdAt',
		});
	}
}

export const db = new TenseMasterDb();
