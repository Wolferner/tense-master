'use client';

import type {
	FixedLimit,
	Step,
	TrainingMode,
} from '@/presentation/web/pages/TenseTrainer/logic/types';
import { ExerciseResponseDto } from '@/server/aplication/exercise';
import { TenseType } from '@/server/domain/value-objects';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchExercises } from '../api/fetchExercises';
import { DEFAULT_TENSES } from '../config/storeDefaults';
import { ITenseGroup } from '../config/tenseLabels';
import { validateAnswer } from '../lib';

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

interface TenseStoreState {
	selectedTenses: TenseType[];
	mode: TrainingMode;
	fixedLimit: FixedLimit;
	exercises: ExerciseResponseDto[];
	answers: Record<string, ExerciseAnswer[]>;
	sessionId: string;
	step: Step;
	currentExerciseIndex: number;
	isLoading: boolean;
}

interface TenseStoreActions {
	toggleTense: (tense: TenseType) => void;
	selectAll: () => void;
	clearAll: () => void;
	toggleGroup: (group: ITenseGroup) => void;
	updateMode: (patch: { mode?: TrainingMode; limit?: FixedLimit }) => void;

	setStep: (step: Step) => void;
	submitAnswer: (answer: ExerciseAnswer['answer'], exerciseId: ExerciseResponseDto['id']) => void;

	startTraining: () => Promise<void>;
	nextExercise: () => Promise<void>;
}

type TenseStore = TenseStoreState & TenseStoreActions;

export const useTenseStore = create<TenseStore>()(
	persist(
		(set, get) => ({
			selectedTenses: DEFAULT_TENSES,
			mode: 'fixed',
			fixedLimit: 10,
			exercises: [],
			answers: {},
			sessionId: '',
			step: 'select',
			currentExerciseIndex: 0,
			isLoading: false,

			toggleTense: tense =>
				set(state => ({
					selectedTenses: state.selectedTenses.includes(tense)
						? state.selectedTenses.filter(t => t !== tense)
						: [...state.selectedTenses, tense],
				})),
			selectAll: () => set({ selectedTenses: DEFAULT_TENSES }),
			clearAll: () => set({ selectedTenses: [] }),
			updateMode: ({ mode, limit }) =>
				set(prev => ({
					mode: mode ?? prev.mode,
					fixedLimit: limit ?? prev.fixedLimit,
				})),
			toggleGroup: group =>
				set(state => {
					const allSelected = group.tenses.every(tense => state.selectedTenses.includes(tense));
					const newSelectedTenses = allSelected
						? state.selectedTenses.filter(t => !group.tenses.includes(t))
						: [
								...state.selectedTenses,
								...group.tenses.filter(t => !state.selectedTenses.includes(t)),
							];
					return { selectedTenses: newSelectedTenses };
				}),

			setStep: step => set({ step }),

			submitAnswer: (answer, exerciseId) => {
				const { exercises, sessionId } = get();
				const exercise = exercises.find(e => e.id === exerciseId)!;
				const skipped = answer.trim().length === 0;
				const createdAt = new Date().toISOString();
				const record: ExerciseAnswer = skipped
					? { answer, skipped: true, createdAt, sessionId }
					: {
							answer,
							skipped: false,
							isCorrect: validateAnswer(answer, exercise.answer),
							createdAt,
							sessionId,
						};
				set(state => {
					const previousAnswers = state.answers[exerciseId] || [];
					return {
						answers: { ...state.answers, [exerciseId]: [...previousAnswers, record] },
					};
				});
			},

			startTraining: async () => {
				const { selectedTenses, mode, fixedLimit } = get();
				if (selectedTenses.length === 0) return;
				set({ isLoading: true });
				const newExercises = await fetchExercises(
					selectedTenses,
					mode === 'fixed' ? fixedLimit : 10,
				);
				set({
					exercises: newExercises,
					sessionId: crypto.randomUUID(),
					currentExerciseIndex: 0,
					step: 'training',
					isLoading: false,
				});
			},

			nextExercise: async () => {
				const { mode, selectedTenses, currentExerciseIndex, exercises } = get();
				if (mode === 'infinite') {
					set({ isLoading: true });
					const data = await fetchExercises(selectedTenses, 1);
					set(prev => ({
						exercises: [...prev.exercises, ...data],
						currentExerciseIndex: prev.currentExerciseIndex + 1,
						step: 'training',
						isLoading: false,
					}));
					return;
				}
				if (currentExerciseIndex + 1 < exercises.length) {
					set({ currentExerciseIndex: currentExerciseIndex + 1, step: 'training' });
				} else {
					set({ step: 'select' });
				}
			},
		}),

		{
			name: 'tense-settings',
			partialize: state => ({
				selectedTenses: state.selectedTenses,
				mode: state.mode,
				fixedLimit: state.fixedLimit,
				answers: state.answers,
				sessionId: state.sessionId,
				exercises: state.exercises,
				step: state.step,
				currentExerciseIndex: state.currentExerciseIndex,
			}),
		},
	),
);
