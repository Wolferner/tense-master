export class ExerciseAnswer {
	constructor(
		readonly id: string,
		readonly sessionId: string,
		readonly exerciseId: string,
		readonly userAnswer: string,
		readonly skipped: boolean,
		readonly isCorrect: boolean | null,
		readonly createdAt: string,
	) {}
}
