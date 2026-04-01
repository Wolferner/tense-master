import { Dexie, type EntityTable } from 'dexie';
import { ExerciseAnswer } from '../types/ExerciseAnswer';

const local_db = new Dexie('tense-tracker-db') as Dexie & {
	answers: EntityTable<ExerciseAnswer, 'id'>;
};

local_db.version(1).stores({
	answers: '++id, answer, skipped, isCorrect, createdAt, sessionId',
});

export { local_db };
