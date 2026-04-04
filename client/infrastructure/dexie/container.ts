import { ExerciseSessionService } from '@/client/application/services/ExerciseSessionService';
import { ExerciseSyncService } from '@/client/application/services/ExerciseSyncService';
import { db } from './db';
import { DexieAnswerRepository } from './DexieAnswerRepository';
import { DexieExerciseRepository } from './DexieExerciseRepository';
import { DexieSessionRepository } from './DexieSessionRepository';

export const exerciseLocalRepository = new DexieExerciseRepository(db);
export const sessionRepository = new DexieSessionRepository(db);
export const answerRepository = new DexieAnswerRepository(db);

export const exerciseSessionService = new ExerciseSessionService(exerciseLocalRepository);
export const exerciseSyncService = new ExerciseSyncService(exerciseLocalRepository);
