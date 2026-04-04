import { TenseType } from '@/domain/value-objects';
import { ExerciseResponseDto } from '@/server/aplication/exercise/dto/ExerciseResponseDto';

async function getSeedFallback(tenses: TenseType[], limit: number): Promise<ExerciseResponseDto[]> {
	const all: ExerciseResponseDto[] = await fetch('/fallback-exercises.json').then(r => r.json());
	const pool = all.filter(e => tenses.includes(e.tense as TenseType));
	const shuffled = pool.sort(() => Math.random() - 0.5);

	if (shuffled.length >= limit) return shuffled.slice(0, limit);

	const repeated = Array.from({ length: limit }, (_, i) => shuffled[i % shuffled.length]);
	return repeated;
}

export async function fetchExercises(
	tenses: TenseType[],
	limit: number,
): Promise<ExerciseResponseDto[]> {
	try {
		debugger;
		const params = new URLSearchParams({ tenses: tenses.join(','), limit: String(limit) });
		const res = await fetch(`/api/excersises?${params}`);
		if (!res.ok) throw new Error('Network response not ok');
		return res.json();
	} catch {
		return getSeedFallback(tenses, limit);
	}
}
