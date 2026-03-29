import { ExerciseResponseDto } from '@/server/aplication/exercise/dto/ExerciseResponseDto';
import { TenseType } from '@/server/domain/value-objects';

export async function fetchExercises(
	tenses: TenseType[],
	limit: number,
): Promise<ExerciseResponseDto[]> {
	const params = new URLSearchParams({ tenses: tenses.join(','), limit: String(limit) });
	const res = await fetch(`/api/excersises?${params}`);
	return res.json();
}
