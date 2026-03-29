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
}

interface TenseStoreActions {
	toggleTense: (tense: TenseType) => void;
	selectAll: () => void;
	clearAll: () => void;

	updateMode: (patch: { mode?: TrainingMode; limit?: FixedLimit }) => void;

	setStep: (step: Step) => void;
	setCurrentExerciseIndex: (index: number) => void;
	setIsLoading: (isLoading: boolean) => void;
	patchExercises: (exercises: ExerciseResponseDto[]) => void;
	toggleGroup: (group: ITenseGroup) => void;
}

type TenseStore = TenseStoreState & TenseStoreActions;

export const useTenseStore = create<TenseStore>()(
	persist(
		set => ({
			selectedTenses: DEFAULT_TENSES,
			mode: 'fixed',
			fixedLimit: 10,
			exercises: [],
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

			patchExercises: exercises => set(prev => ({ exercises: [...prev.exercises, ...exercises] })),
			setStep: step => set({ step }),
			setCurrentExerciseIndex: index => set({ currentExerciseIndex: index }),
			setIsLoading: isLoading => set({ isLoading }),
			updateMode: ({ mode, limit }) =>
				set(prev => ({
					mode: mode ?? prev.mode,
					fixedLimit: limit ?? prev.fixedLimit,
				})),
			toggleGroup: group => {
				set(state => {
					const allSelected = group.tenses.every(tense => state.selectedTenses.includes(tense));

					const newSelectedTenses = allSelected
						? state.selectedTenses.filter(t => !group.tenses.includes(t))
						: [
								...state.selectedTenses,
								...group.tenses.filter(t => !state.selectedTenses.includes(t)),
							];

					return { selectedTenses: newSelectedTenses };
				});
			},
		}),
		{ name: 'tense-settings' },
	),
);

export const trainerSelector = (state: TenseStore) => ({});
