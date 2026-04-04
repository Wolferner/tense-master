import { PrismaClient, TenseExerciseQuestion } from '@/prisma/generated/prisma/client';
import { Exercise } from '../../../domain/entities/Exercise';
import { IExerciseRepository } from '../../../domain/repositories';
import { Tense } from '../../../domain/value-objects';

export class PrismaExerciseRepository implements IExerciseRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async create(exercise: Exercise): Promise<Exercise> {
		const record = await this.prisma.tenseExerciseQuestion.create({
			data: {
				tense: exercise.tense,
				question: exercise.question,
				answer: exercise.answer,
				explanation: exercise.explanation,
			},
		});

		return this.toDomain(record);
	}

	async findById(id: Exercise['id']): Promise<Exercise | null> {
		const record = await this.prisma.tenseExerciseQuestion.findUnique({
			where: { id },
		});

		return record ? this.toDomain(record) : null;
	}

	async findByTenses(tenses: Tense[]): Promise<Exercise[]> {
		const records = await this.prisma.tenseExerciseQuestion.findMany({
			where: { tense: { in: tenses } },
		});

		return records.map(r => this.toDomain(r));
	}

	async findRandom(tenses: Tense[], limit: number): Promise<Exercise[]> {
		const records = await this.prisma.tenseExerciseQuestion.findMany({
			where: { tense: { in: tenses } },
		});

		return records
			.sort(() => Math.random() - 0.5)
			.slice(0, limit)
			.map(r => this.toDomain(r));
	}

	private toDomain(record: TenseExerciseQuestion): Exercise {
		return new Exercise(
			record.tense,
			record.question,
			record.answer,
			record.explanation,
			record.id,
			record.createdAt,
			record.updatedAt,
		);
	}
}
