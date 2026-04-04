import { ExerciseSessionService } from '@/client/application/services/ExerciseSessionService';
import { ExerciseApiRepository } from './ExerciseApiRepository';

const exerciseRepository = new ExerciseApiRepository();

export const exerciseSessionService = new ExerciseSessionService(exerciseRepository);
