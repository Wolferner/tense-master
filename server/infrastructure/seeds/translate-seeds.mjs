/**
 * Step 2: Add fr/de/es translations to already-reformatted seed files.
 * Makes exactly 1 claude CLI call per file (12 total).
 *
 * Run AFTER reformat-seeds.mjs:
 *   node server/infrastructure/seeds/translate-seeds.mjs
 *
 * Resume-safe: skips files that already have fr/de/es translations.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, 'data');

const FILES = [
	'present-simple.json',
	'present-continuous.json',
	'present-perfect.json',
	'present-perfect-continuous.json',
	'past-simple.json',
	'past-continuous.json',
	'past-perfect.json',
	'past-perfect-continuous.json',
	'future-simple.json',
	'future-continuous.json',
	'future-perfect.json',
	'future-perfect-continuous.json',
];

function sleep(ms) {
	return new Promise(r => setTimeout(r, ms));
}

function callClaude(prompt, retries = 3) {
	const attempt = (resolve, reject, n) => {
		let stdout = '';
		let stderr = '';

		const child = spawn('claude', ['-p', prompt], {
			shell: false,
			stdio: ['ignore', 'pipe', 'pipe'],
		});

		child.stdout.on('data', d => (stdout += d.toString('utf-8')));
		child.stderr.on('data', d => (stderr += d.toString('utf-8')));
		child.on('error', reject);
		child.on('close', code => {
			if (code === 0) return resolve(stdout);
			if (n < retries - 1) {
				console.log(`  Retry ${n + 1}...`);
				return sleep(3000).then(() => attempt(resolve, reject, n + 1));
			}
			reject(new Error(stderr || `claude exited with code ${code}`));
		});
	};

	return new Promise((res, rej) => attempt(res, rej, 0));
}

function extractJson(text) {
	const match = text.match(/\[[\s\S]*\]/);
	if (!match) throw new Error(`No JSON array in response:\n${text.slice(0, 300)}`);
	return JSON.parse(match[0]);
}

async function translateFile(filename) {
	const filePath = join(DATA_DIR, filename);
	const file = JSON.parse(readFileSync(filePath, 'utf-8'));

	// Skip if translations already exist for all locales
	const first = file.exercises[0];
	if (!first?.translations) {
		console.log(`${filename}: not reformatted yet — run reformat-seeds.mjs first.`);
		return;
	}
	if (first.translations.fr) {
		console.log(`${filename}: already translated, skipping.`);
		return;
	}

	const total = file.exercises.length;
	console.log(`\n${filename}: translating ${total} exercises in 1 call...`);

	const input = file.exercises.map((ex, i) => ({
		id: i,
		question: ex.translations.ru.question,
		explanation: ex.translations.ru.explanation,
	}));

	const prompt = `You are a professional translator of English grammar learning materials.

Translate each item from Russian into French (fr), German (de), and Spanish (es).

Rules:
- "question": a sentence the student must translate into English — translate the Russian sentence naturally into the target language.
- "explanation": a grammar tip about English tenses written in Russian — translate into the target language, keeping the content about English grammar.
- Return ONLY a valid JSON array, no markdown, no commentary.

Input (${total} items):
${JSON.stringify(input)}

Output format:
[{"id":0,"fr":{"question":"...","explanation":"..."},"de":{"question":"...","explanation":"..."},"es":{"question":"...","explanation":"..."}}]`;

	const text = await callClaude(prompt);
	const translations = extractJson(text);

	const byId = Object.fromEntries(translations.map(t => [t.id, t]));

	const newExercises = file.exercises.map((ex, i) => {
		const t = byId[i];
		if (!t) throw new Error(`Missing translation for exercise ${i}`);
		return {
			answer: ex.answer,
			translations: {
				ru: ex.translations.ru,
				fr: t.fr,
				de: t.de,
				es: t.es,
			},
		};
	});

	writeFileSync(
		filePath,
		JSON.stringify({ tense: file.tense, exercises: newExercises }, null, '\t'),
		'utf-8',
	);

	console.log(`  Saved.`);
}

async function main() {
	for (const filename of FILES) {
		await translateFile(filename);
	}
	console.log('\nAll files translated.');
}

main().catch(err => {
	console.error('\nFatal:', err.message);
	process.exit(1);
});
