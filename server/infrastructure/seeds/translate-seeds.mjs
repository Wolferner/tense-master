/**
 * Converts seed JSON files from old flat format to new multilingual format.
 *
 * Old format:  { question: "ru", answer: "en", explanation: "ru" }
 * New format:  { answer: "en", translations: { ru, fr, de, es: { question, explanation } } }
 *
 * Uses the Claude Code CLI (claude -p) — no API key required.
 *
 * Run:    node server/infrastructure/seeds/translate-seeds.mjs
 * Resume: safe to re-run — already-converted files are skipped automatically.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
const BATCH_SIZE = 20;

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
	// Use spawn with shell:false so the prompt is passed as a raw argument —
	// no shell quoting, no Windows escaping issues with JSON content.
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
				console.log(`    Retry ${n + 1}...`);
				return sleep(3000).then(() => attempt(resolve, reject, n + 1));
			}
			reject(new Error(stderr || `claude exited with code ${code}`));
		});
	};

	return new Promise((res, rej) => attempt(res, rej, 0));
}

function extractJson(text) {
	const match = text.match(/\[[\s\S]*\]/);
	if (!match) throw new Error(`No JSON array in response:\n${text.slice(0, 500)}`);
	return JSON.parse(match[0]);
}

async function translateBatch(exercises) {
	const input = exercises.map((ex, i) => ({
		id: i,
		question: ex.question,
		explanation: ex.explanation,
	}));

	const prompt = `You are a professional linguistics translator specializing in English grammar learning materials.

Translate the items below from Russian into French (fr), German (de), and Spanish (es).

Translation rules:
- "question" is a sentence the student must translate into English. Translate the Russian sentence naturally into the target language.
- "explanation" is a grammar tip about English tenses written in Russian. Translate it into the target language — keep the content about English grammar, only the language of the explanation changes.
- Preserve any grammar term formatting (e.g., Present Simple, -s ending references, etc.).
- Return ONLY a valid JSON array. No markdown fences, no extra commentary.

Input JSON:
${JSON.stringify(input)}

Required output format:
[{"id":0,"fr":{"question":"...","explanation":"..."},"de":{"question":"...","explanation":"..."},"es":{"question":"...","explanation":"..."}}]`;

	const text = await callClaude(prompt);
	const parsed = extractJson(text);

	const byId = {};
	for (const t of parsed) byId[t.id] = t;
	return byId;
}

async function processFile(filename) {
	const filePath = join(DATA_DIR, filename);
	const file = JSON.parse(readFileSync(filePath, 'utf-8'));

	// Already converted — skip
	if (file.exercises[0]?.translations) {
		console.log(`${filename}: already converted, skipping.`);
		return;
	}

	const total = file.exercises.length;
	const batches = Math.ceil(total / BATCH_SIZE);
	console.log(`\n${filename}: ${total} exercises, ${batches} batches`);

	const newExercises = [];

	for (let i = 0; i < total; i += BATCH_SIZE) {
		const batch = file.exercises.slice(i, i + BATCH_SIZE);
		const batchNum = Math.floor(i / BATCH_SIZE) + 1;
		process.stdout.write(`  batch ${batchNum}/${batches} ... `);

		const byId = await translateBatch(batch);

		for (let j = 0; j < batch.length; j++) {
			const ex = batch[j];
			const trans = byId[j];

			if (!trans) throw new Error(`Missing translation for item ${j} in batch ${batchNum}`);

			newExercises.push({
				answer: ex.answer,
				translations: {
					ru: { question: ex.question, explanation: ex.explanation },
					fr: trans.fr,
					de: trans.de,
					es: trans.es,
				},
			});
		}

		console.log('done');
	}

	const newFile = { tense: file.tense, exercises: newExercises };
	writeFileSync(filePath, JSON.stringify(newFile, null, '\t'), 'utf-8');
	console.log(`  Saved.`);
}

async function main() {
	// Verify claude CLI is available
	await new Promise((resolve, reject) => {
		const child = spawn('claude', ['--version'], { shell: false, stdio: 'ignore' });
		child.on('error', () => {
			console.error('Error: claude CLI not found. Make sure Claude Code is installed and in PATH.');
			process.exit(1);
		});
		child.on('close', resolve);
	});

	for (const filename of FILES) {
		await processFile(filename);
	}

	console.log('\nAll files processed.');
}

main().catch(err => {
	console.error('\nFatal:', err.message);
	process.exit(1);
});
