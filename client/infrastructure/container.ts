import { ExerciseSessionService } from '@/client/application/services/ExerciseSessionService';
import { ExerciseSyncService } from '@/client/application/services/ExerciseSyncService';
import { ProfileService } from '../application/services/ProfileService';
import { db } from './dexie/db';
import { DexieAnswerRepository } from './dexie/DexieAnswerRepository';
import { DexieExerciseRepository } from './dexie/DexieExerciseRepository';
import { DexieSessionRepository } from './dexie/DexieSessionRepository';
import { ExerciseApi } from './http/ExerciseApi';

export const exerciseLocalRepository = new DexieExerciseRepository(db);
export const sessionRepository = new DexieSessionRepository(db);
export const answerRepository = new DexieAnswerRepository(db);

const exerciseApi = new ExerciseApi();

export const exerciseSessionService = new ExerciseSessionService(
	exerciseLocalRepository,
	sessionRepository,
	answerRepository,
);
export const exerciseSyncService = new ExerciseSyncService(exerciseLocalRepository, exerciseApi);
export const profileService = new ProfileService();
