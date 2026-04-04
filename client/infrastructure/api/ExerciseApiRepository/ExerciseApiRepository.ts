import { type IExerciseApiRepository } from '@/client/application/repositories/IExerciseApiRepository';
import { type TenseType } from '@/domain/value-objects';
import { type ExerciseResponseDto } from '@/shared/dtos';

export class ExerciseApiRepository implements IExerciseApiRepository {
	async findRandom(tenses: TenseType[], limit: number): Promise<ExerciseResponseDto[]> {
		try {
			const params = new URLSearchParams({ tenses: tenses.join(','), limit: String(limit) });
			const res = await fetch(`/api/exercises?${params}`);
			if (!res.ok) throw new Error('Network response not ok');
			return res.json();
		} catch {
			return this.#getSeedFallback(tenses, limit);
		}
	}

	async #getSeedFallback(tenses: TenseType[], limit: number): Promise<ExerciseResponseDto[]> {
		const all: ExerciseResponseDto[] = await fetch('/fallback-exercises.json').then(r => r.json());
		const pool = all.filter(e => tenses.includes(e.tense as TenseType));
		const shuffled = pool.sort(() => Math.random() - 0.5);

		if (shuffled.length >= limit) return shuffled.slice(0, limit);

		const repeated = Array.from({ length: limit }, (_, i) => shuffled[i % shuffled.length]);
		return repeated;
	}
}
