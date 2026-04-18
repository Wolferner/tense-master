import {
	PrismaClient,
	Locale as PrismaLocale,
	TenseExerciseQuestion,
	TenseExerciseTranslation,
} from '@/prisma/generated/prisma/client';
import { CreateExerciseDb } from '@/server/application/repositories/IExerciseRepository';
import { Exercise } from '../../../domain/entities/Exercise';
import { Locale, Tense } from '../../../domain/value-objects';
import { IExerciseRepository } from '../../application/repositories';

type ExerciseWithTranslation = TenseExerciseQuestion & {
	translations: TenseExerciseTranslation[];
};

export class PrismaExerciseRepository implements IExerciseRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async create(data: CreateExerciseDb): Promise<void> {
		const record = await this.prisma.tenseExerciseQuestion.create({
			data: {
				tense: data.tense,
				answer: data.answer,
				translations: {
					createMany: {
						data: data.translations.map(t => ({
							locale: t.locale as PrismaLocale,
							question: t.question,
							explanation: t.explanation,
						})),
						skipDuplicates: true,
					},
				},
			},
		});
	}

	async findById(id: Exercise['id'], locale: Locale): Promise<Exercise | null> {
		const record = await this.prisma.tenseExerciseQuestion.findUnique({
			where: { id },
			include: {
				translations: { where: { locale: locale as PrismaLocale } },
			},
		});

		if (!record || record.translations.length === 0) return null;
		return this.toDomain(record as ExerciseWithTranslation);
	}

	async findByTenses(tenses: Tense[], locale: Locale): Promise<Exercise[]> {
		const records = await this.prisma.tenseExerciseQuestion.findMany({
			where: { tense: { in: tenses } },
			include: {
				translations: { where: { locale: locale as PrismaLocale } },
			},
		});

		return (records as ExerciseWithTranslation[])
			.filter(r => r.translations.length > 0)
			.map(r => this.toDomain(r));
	}

	async findRandom(tenses: Tense[], limit: number, locale: Locale): Promise<Exercise[]> {
		const records = await this.prisma.tenseExerciseQuestion.findMany({
			where: { tense: { in: tenses } },
			include: {
				translations: { where: { locale: locale as PrismaLocale } },
			},
		});

		return (records as ExerciseWithTranslation[])
			.filter(r => r.translations.length > 0)
			.sort(() => Math.random() - 0.5)
			.slice(0, limit)
			.map(r => this.toDomain(r));
	}

	async findLatestUpdatedAt(locale: Locale): Promise<Date | null> {
		const result = await this.prisma.tenseExerciseTranslation.findFirst({
			where: { locale: locale as PrismaLocale },
			orderBy: { updatedAt: 'desc' },
			select: { updatedAt: true },
		});
		return result?.updatedAt ?? null;
	}

	async findAll(locale: Locale): Promise<Exercise[]> {
		const records = await this.prisma.tenseExerciseQuestion.findMany({
			include: {
				translations: { where: { locale: locale as PrismaLocale } },
			},
		});

		return (records as ExerciseWithTranslation[])
			.filter(r => r.translations.length > 0)
			.map(r => this.toDomain(r));
	}

	private toDomain(record: ExerciseWithTranslation): Exercise {
		const translation = record.translations[0];
		return new Exercise(
			record.tense,
			translation.question,
			record.answer,
			translation.explanation,
			record.id,
			record.createdAt,
			translation.updatedAt,
		);
	}
}
