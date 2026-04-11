import { MAX_EXERCISES } from '@/shared/config/constants';
import { ExerciseResponseDto } from '@/shared/dtos';
import { CreateExerciseDto } from '@/shared/dtos/CreateExerciseDto';
import { Exercise } from '../../../domain/entities/Exercise';
import { Locale, Tense } from '../../../domain/value-objects';
import { IExerciseRepository } from '../repositories';

export class ExerciseService {
	constructor(private readonly exerciseRepository: IExerciseRepository) {}

	async create(dto: CreateExerciseDto): Promise<void> {
		await this.exerciseRepository.create({
			tense: dto.tense,
			answer: dto.answer,
			translations: dto.translations.map(t => ({
				locale: t.locale,
				question: t.question,
				explanation: t.explanation,
			})),
		});
	}

	async findRandom(tenses: Tense[], limit: number, locale: Locale): Promise<ExerciseResponseDto[]> {
		if (tenses.length === 0) return [];

		if (limit < 0 || limit > MAX_EXERCISES) {
			throw new Error(`Limit must be between 1 and ${MAX_EXERCISES}`);
		}

		const exercises = await this.exerciseRepository.findRandom(tenses, limit, locale);
		if (exercises.length === 0) return [];
		if (exercises.length >= limit) return exercises.map(e => this.toDto(e));
		const repeated = Array.from({ length: limit }, (_, i) => exercises[i % exercises.length]);
		return repeated.map(e => this.toDto(e));
	}

	async getLastUpdatedAt(locale: Locale): Promise<string | null> {
		const latest = await this.exerciseRepository.findLatestUpdatedAt(locale);
		return latest ? latest.toISOString() : null;
	}

	async findAll(locale: Locale): Promise<ExerciseResponseDto[]> {
		const exercises = await this.exerciseRepository.findAll(locale);
		return exercises.map(e => this.toDto(e));
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
