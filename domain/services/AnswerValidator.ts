class AnswerValidator {
	validate(userAnswer: string, exerciseAnswer: string): boolean {
		return userAnswer.trim().toLowerCase() === exerciseAnswer.trim().toLowerCase();
	}
}

export const answerValidator = new AnswerValidator();
