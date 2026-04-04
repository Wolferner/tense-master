import { ExerciseSessionService } from '@/client/application/services/ExerciseSessionService';
import { ExerciseSyncService } from '@/client/application/services/ExerciseSyncService';
import { db } from './dexie/db';
import { DexieAnswerRepository } from './dexie/DexieAnswerRepository';
import { DexieExerciseRepository } from './dexie/DexieExerciseRepository';
import { DexieSessionRepository } from './dexie/DexieSessionRepository';

export const exerciseLocalRepository = new DexieExerciseRepository(db);
export const sessionRepository = new DexieSessionRepository(db);
export const answerRepository = new DexieAnswerRepository(db);

export const exerciseSessionService = new ExerciseSessionService(
	exerciseLocalRepository,
	sessionRepository,
	answerRepository,
);
export const exerciseSyncService = new ExerciseSyncService(exerciseLocalRepository);
