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

interface TenseStoreState {
	selectedTenses: TenseType[];
	mode: TrainingMode;
	fixedLimit: FixedLimit;
	exercises: ExerciseResponseDto[];
	step: Step;
	currentExerciseIndex: number;
	isLoading: boolean;
	userAnswer: string;
}

interface TenseStoreActions {
	toggleTense: (tense: TenseType) => void;
	selectAll: () => void;
	clearAll: () => void;
	toggleGroup: (group: ITenseGroup) => void;
	updateMode: (patch: { mode?: TrainingMode; limit?: FixedLimit }) => void;

	setStep: (step: Step) => void;
	setUserAnswer: (answer: string) => void;

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
			step: 'select',
			currentExerciseIndex: 0,
			isLoading: false,
			userAnswer: '',

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
			setUserAnswer: answer => set({ userAnswer: answer }),

			startTraining: async () => {
				const { selectedTenses, mode, fixedLimit } = get();
				if (selectedTenses.length === 0) return;
				set({ isLoading: true });
				const data = await fetchExercises(selectedTenses, mode === 'fixed' ? fixedLimit : 10);
				set(prev => ({
					exercises: [...prev.exercises, ...data],
					currentExerciseIndex: 0,
					userAnswer: '',
					step: 'training',
					isLoading: false,
				}));
			},

			nextExercise: async () => {
				const { mode, selectedTenses, currentExerciseIndex, exercises } = get();
				if (mode === 'infinite') {
					set({ isLoading: true });
					const data = await fetchExercises(selectedTenses, 1);
					set(prev => ({
						exercises: [...prev.exercises, ...data],
						currentExerciseIndex: prev.currentExerciseIndex + 1,
						userAnswer: '',
						step: 'training',
						isLoading: false,
					}));
					return;
				}
				if (currentExerciseIndex + 1 < exercises.length) {
					set({ currentExerciseIndex: currentExerciseIndex + 1, userAnswer: '', step: 'training' });
				} else {
					set({ step: 'select' });
				}
			},
		}),
		{ name: 'tense-settings' },
	),
);
