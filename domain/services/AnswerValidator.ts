export const validateAnswer = (userAnswer: string, exerciseAnswer: string): boolean => {
	return userAnswer.trim().toLowerCase() === exerciseAnswer.trim().toLowerCase();
};
