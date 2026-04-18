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
		this.version(3)
			.stores({
				exercises: 'id, tense, locale, updatedAt',
				sessions: 'id, status, createdAt',
				answers: 'id, sessionId, exerciseId, locale, createdAt',
			})
			.upgrade(async tx => {
				await tx.table('exercises').clear();
				Object.keys(localStorage)
					.filter(k => k.startsWith('tense-last-synced-'))
					.forEach(k => localStorage.removeItem(k));
			});
		this.version(4)
			.stores({
				exercises: null,
				sessions: 'id, status, createdAt',
				answers: 'id, sessionId, exerciseId, locale, createdAt',
			})
			.upgrade(() => {
				Object.keys(localStorage)
					.filter(k => k.startsWith('tense-last-synced-'))
					.forEach(k => localStorage.removeItem(k));
			});
		this.version(5).stores({
			exercises: '[id+locale], tense, locale, updatedAt',
			sessions: 'id, status, createdAt',
			answers: 'id, sessionId, exerciseId, locale, createdAt',
		});
	}
}

export const db = new TenseMasterDb();
