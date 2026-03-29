import type { TenseStore } from './useTenseStore';

export const selectTrainingSection = (s: TenseStore) => ({
	sessionId: s.sessionId,
	mode: s.mode,
	exercises: s.exercises,
	currentExerciseIndex: s.currentExerciseIndex,
	isLoading: s.isLoading,
	answers: s.answers,
	setStep: s.setStep,
	nextExercise: s.nextExercise,
	submitAnswer: s.submitAnswer,
});

export const selectSelectSection = (s: TenseStore) => ({
	selectedTenses: s.selectedTenses,
	mode: s.mode,
	fixedLimit: s.fixedLimit,
	exercises: s.exercises,
	isLoading: s.isLoading,
	toggleTense: s.toggleTense,
	selectAll: s.selectAll,
	clearAll: s.clearAll,
	toggleGroup: s.toggleGroup,
	updateMode: s.updateMode,
	setStep: s.setStep,
	startTraining: s.startTraining,
});

export const selectStep = (s: TenseStore) => s.step;
