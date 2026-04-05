import { MAX_EXERCISES } from '@/shared/config/constants';
import { ExerciseResponseDto } from '@/shared/dtos';
import { CreateExerciseDto } from '@/shared/dtos/CreateExerciseDto';
import { Exercise } from '../../../domain/entities/Exercise';
import { Tense } from '../../../domain/value-objects';
import { IExerciseRepository } from '../repositories';

export class ExerciseService {
	constructor(private readonly exerciseRepository: IExerciseRepository) {}

	async create(dto: CreateExerciseDto): Promise<ExerciseResponseDto> {
		const exercise = new Exercise(
			dto.tense,
			dto.question,
			dto.answer,
			dto.explanation,

			crypto.randomUUID(), // generate id here since the domain entity is not responsible for it
			new Date(), // createdAt
			new Date(), // updatedAt
		);
		const createdExercise = await this.exerciseRepository.create(exercise);
		return this.toDto(createdExercise);
	}

	async findRandom(tenses: Tense[], limit: number): Promise<ExerciseResponseDto[]> {
		if (tenses.length === 0) return [];

		if (limit < 0 || limit > MAX_EXERCISES) {
			throw new Error(`Limit must be between 1 and ${MAX_EXERCISES}`);
		}

		const exercises = await this.exerciseRepository.findRandom(tenses, limit);
		if (exercises.length === 0) return [];
		if (exercises.length >= limit) return exercises.map(this.toDto);
		const repeated = Array.from({ length: limit }, (_, i) => exercises[i % exercises.length]);
		return repeated.map(this.toDto);
	}

	async getLastUpdatedAt(): Promise<string | null> {
		const latest = await this.exerciseRepository.findLatestUpdatedAt();
		return latest ? latest.toISOString() : null;
	}

	async findAll(): Promise<ExerciseResponseDto[]> {
		const exercises = await this.exerciseRepository.findAll();
		return exercises.map(this.toDto);
	}

	private toDto(exercise: Exercise): ExerciseResponseDto {
		return {
			id: exercise.id,
			tense: exercise.tense,
			question: exercise.question,
			answer: exercise.answer,
			explanation: exercise.explanation,
			createdAt: exercise.createdAt,
			updatedAt: exercise.updatedAt,
		};
	}
}
