type ExerciseAnswerManual = {
	answer: string;
	skipped: false;
	isCorrect: boolean;
	createdAt: string;
	sessionId: string;
};

type ExerciseAnswerSkipped = {
	answer: string;
	skipped: true;
	createdAt: string;
	sessionId: string;
};

export type ExerciseAnswer = ExerciseAnswerManual | ExerciseAnswerSkipped;
