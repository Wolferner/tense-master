import { ExerciseService } from '../../application/exercise';
import { PrismaExerciseRepository } from '../prisma-orm/PrismaExerciseRepository';
import { prisma } from '../prisma-orm/prismaClient';
import { ExerciseController } from './ExerciseController';

const exerciseRepository = new PrismaExerciseRepository(prisma);
const exerciseService = new ExerciseService(exerciseRepository);

export const exerciseController = new ExerciseController(exerciseService);
