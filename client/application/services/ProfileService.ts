import type { ExerciseAnswer } from '@/domain/entities/Answer';
import type { Session } from '@/domain/entities/Session';
import type { TenseType } from '@/domain/value-objects';
import type { ExerciseResponseDto } from '@/shared/dtos';

export type OverallStats = {
	total: number;
	correct: number;
	skipped: number;
	accuracy: number;
};

export type TenseStat = {
	tense: TenseType;
	total: number;
	correct: number;
	accuracy: number;
};

export type SessionSummary = {
	session: Session;
	total: number;
	correct: number;
	skipped: number;
	accuracy: number;
};

export type AnswerWithExercise = ExerciseAnswer & { exercise: ExerciseResponseDto };

function pct(correct: number, attempted: number): number {
	return attempted === 0 ? 0 : Math.round((correct / attempted) * 100);
}

export class ProfileService {
	getOverallStats(answers: ExerciseAnswer[]): OverallStats {
		const total = answers.length;
		const skipped = answers.filter(a => a.skipped).length;
		const correct = answers.filter(a => !a.skipped && a.isCorrect).length;
		return { total, correct, skipped, accuracy: pct(correct, total - skipped) };
	}

	getTenseStats(answers: ExerciseAnswer[], exercises: ExerciseResponseDto[]): TenseStat[] {
		const exerciseMap = new Map(exercises.map(e => [e.id, e]));
		const byTense = new Map<TenseType, ExerciseAnswer[]>();

		for (const answer of answers) {
			const exercise = exerciseMap.get(answer.exerciseId);
			if (!exercise) continue;
			const tense = exercise.tense as TenseType;
			byTense.set(tense, [...(byTense.get(tense) ?? []), answer]);
		}

		return Array.from(byTense.entries()).map(([tense, tenseAnswers]) => {
			const total = tenseAnswers.length;
			const skipped = tenseAnswers.filter(a => a.skipped).length;
			const correct = tenseAnswers.filter(a => !a.skipped && a.isCorrect).length;
			return { tense, total, correct, accuracy: pct(correct, total - skipped) };
		});
	}

	getSessionSummaries(sessions: Session[], answers: ExerciseAnswer[]): SessionSummary[] {
		return sessions
			.map(session => {
				const sa = answers.filter(a => a.sessionId === session.id);
				const total = sa.length;
				const skipped = sa.filter(a => a.skipped).length;
				const correct = sa.filter(a => !a.skipped && a.isCorrect).length;
				return { session, total, correct, skipped, accuracy: pct(correct, total - skipped) };
			})
			.sort(
				(a, b) => new Date(b.session.createdAt).getTime() - new Date(a.session.createdAt).getTime(),
			);
	}

	joinAnswersWithExercises(
		answers: ExerciseAnswer[],
		exercises: ExerciseResponseDto[],
	): AnswerWithExercise[] {
		const exerciseMap = new Map(exercises.map(e => [e.id, e]));
		return answers.flatMap(a => {
			const exercise = exerciseMap.get(a.exerciseId);
			return exercise ? [{ ...a, exercise }] : [];
		});
	}
}

export const profileService = new ProfileService();
