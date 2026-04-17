import type { IExerciseRepository } from '@/client/application/repositories/IExerciseRepository';
import type { LocaleType, TenseType } from '@/domain/value-objects';
import type { ExerciseResponseDto } from '@/shared/dtos';
import type { TenseMasterDb } from './db';

export class DexieExerciseRepository implements IExerciseRepository {
	constructor(private readonly db: TenseMasterDb) {}

	async findRandom(
		tenses: TenseType[],
		limit: number,
		locale: LocaleType,
	): Promise<ExerciseResponseDto[]> {
		const pool = await this.db.exercises
			.where('tense')
			.anyOf(tenses)
			.filter(e => e.locale === locale)
			.toArray();
		const shuffled = pool.sort(() => Math.random() - 0.5);
		if (shuffled.length === 0) return [];
		if (shuffled.length >= limit) return shuffled.slice(0, limit);
		return Array.from({ length: limit }, (_, i) => shuffled[i % shuffled.length]);
	}

	async findById(id: string): Promise<ExerciseResponseDto | undefined> {
		return this.db.exercises.get(id);
	}

	async findAll(): Promise<ExerciseResponseDto[]> {
		return this.db.exercises.toArray();
	}

	async upsertMany(exercises: ExerciseResponseDto[]): Promise<void> {
		await this.db.exercises.bulkPut(exercises);
	}
}
