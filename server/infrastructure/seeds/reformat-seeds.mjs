/**
 * Step 1: Restructure seed JSON files from old flat format to new multilingual format.
 * Moves existing Russian data into translations.ru, leaves fr/de/es empty.
 * No API calls — runs instantly.
 *
 * Run: node server/infrastructure/seeds/reformat-seeds.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, 'data');

const FILES = [
	// 'present-simple.json',
	// 'present-continuous.json',
	// 'present-perfect.json',
	// 'present-perfect-continuous.json',
	// 'past-simple.json',
	// 'past-continuous.json',
	'past-perfect.json',
	'past-perfect-continuous.json',
	'future-simple.json',
	'future-continuous.json',
	'future-perfect.json',
	'future-perfect-continuous.json',
];

for (const filename of FILES) {
	const filePath = join(DATA_DIR, filename);
	const file = JSON.parse(readFileSync(filePath, 'utf-8'));

	if (file.exercises[0]?.translations) {
		console.log(`${filename}: already reformatted, skipping.`);
		continue;
	}

	const newExercises = file.exercises.map(ex => ({
		answer: ex.answer,
		translations: {
			ru: { question: ex.question, explanation: ex.explanation },
		},
	}));

	writeFileSync(
		filePath,
		JSON.stringify({ tense: file.tense, exercises: newExercises }, null, '\t'),
		'utf-8',
	);

	console.log(`${filename}: ${newExercises.length} exercises reformatted.`);
}

console.log('\nDone. Run translate-seeds.mjs to add fr/de/es translations.');
