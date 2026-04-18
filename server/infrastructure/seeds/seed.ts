import { PrismaClient, Locale as PrismaLocale } from '@/prisma/generated/prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ws from 'ws';
import { Tense } from '../../../domain/value-objects';

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

interface SeedTranslation {
	question: string;
	explanation: string;
}

interface SeedExercise {
	answer: string;
	translations: Partial<Record<PrismaLocale, SeedTranslation>>;
}

interface SeedFile {
	tense: Tense;
	exercises: SeedExercise[];
}

const FILES: Record<Tense, string> = {
	PRESENT_SIMPLE: 'present-simple.json',
	PRESENT_CONTINUOUS: 'present-continuous.json',
	PRESENT_PERFECT: 'present-perfect.json',
	PRESENT_PERFECT_CONTINUOUS: 'present-perfect-continuous.json',
	PAST_SIMPLE: 'past-simple.json',
	PAST_CONTINUOUS: 'past-continuous.json',
	PAST_PERFECT: 'past-perfect.json',
	PAST_PERFECT_CONTINUOUS: 'past-perfect-continuous.json',
	FUTURE_SIMPLE: 'future-simple.json',
	FUTURE_CONTINUOUS: 'future-continuous.json',
	FUTURE_PERFECT: 'future-perfect.json',
	FUTURE_PERFECT_CONTINUOUS: 'future-perfect-continuous.json',
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, 'data');

async function main() {
	for (const [tense, filename] of Object.entries(FILES) as [Tense, string][]) {
		const raw = readFileSync(join(DATA_DIR, filename), 'utf-8');
		const file: SeedFile = JSON.parse(raw);

		for (const exercise of file.exercises) {
			const record = await prisma.tenseExerciseQuestion.upsert({
				where: { answer_tense: { answer: exercise.answer, tense } },
				update: {},
				create: { tense, answer: exercise.answer },
			});

			for (const [locale, translation] of Object.entries(exercise.translations) as [
				PrismaLocale,
				SeedTranslation,
			][]) {
				await prisma.tenseExerciseTranslation.upsert({
					where: { exerciseId_locale: { exerciseId: record.id, locale } },
					update: {
						question: translation.question,
						explanation: translation.explanation,
					},
					create: {
						exerciseId: record.id,
						locale,
						question: translation.question,
						explanation: translation.explanation,
					},
				});
			}
		}

		console.log(`Seeded ${file.exercises.length} exercises for ${tense}`);
	}

	await prisma.$disconnect();
}

main().catch(err => {
	console.error(err);
	process.exit(1);
});
