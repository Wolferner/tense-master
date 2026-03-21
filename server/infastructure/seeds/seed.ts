import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@/prisma/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Tense } from '../../domain/value-objects';

interface SeedFile {
	tense: Tense;
	exercises: {
		question: string;
		answer: string;
		explanation: string;
	}[];
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
	const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
	const prisma = new PrismaClient({ adapter });

	for (const [tense, filename] of Object.entries(FILES) as [Tense, string][]) {
		const raw = readFileSync(join(DATA_DIR, filename), 'utf-8');
		const file: SeedFile = JSON.parse(raw);

		for (const exercise of file.exercises) {
			await prisma.tenseExerciseQuestion.upsert({
				where: {
					question_tense: {
						question: exercise.question,
						tense,
					},
				},
				update: {
					answer: exercise.answer,
					explanation: exercise.explanation,
				},
				create: {
					tense,
					question: exercise.question,
					answer: exercise.answer,
					explanation: exercise.explanation,
				},
			});
		}

		console.log(`Seeded ${file.exercises.length} exercises for ${tense}`);
	}

	await prisma.$disconnect();
}

main().catch(err => {
	console.error(err);
	process.exit(1);
});
