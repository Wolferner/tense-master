export type ExerciseAnswerManual = {
	id: number;
	answer: string;
	skipped: false;
	isCorrect: boolean;
	createdAt: string;
	sessionId: string;
};

export type ExerciseAnswerSkipped = {
	id: number;
	answer: string;
	skipped: true;
	createdAt: string;
	sessionId: string;
};

export type ExerciseAnswer = ExerciseAnswerManual | ExerciseAnswerSkipped;
