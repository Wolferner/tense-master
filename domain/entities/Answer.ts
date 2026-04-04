export type ExerciseAnswer = {
	id: string;
	sessionId: string;
	exerciseId: string;
	userAnswer: string;
	skipped: boolean;
	isCorrect: boolean | null;
	createdAt: string;
};
