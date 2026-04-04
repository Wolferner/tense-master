'use client';

import { Tense, type TenseType } from '@/domain/value-objects';
import type { FixedLimit, TrainingMode } from '@/shared/config/training';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_TENSES = Object.values(Tense) as TenseType[];

type SettingsState = {
	selectedTenses: TenseType[];
	mode: TrainingMode;
	fixedLimit: FixedLimit;
};

type SettingsActions = {
	toggleTense(tense: TenseType): void;
	selectAll(): void;
	clearAll(): void;
	toggleGroup(tenses: TenseType[]): void;
	updateMode(patch: { mode?: TrainingMode; limit?: FixedLimit }): void;
};

export type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
	persist(
		set => ({
			selectedTenses: DEFAULT_TENSES,
			mode: 'fixed',
			fixedLimit: 10,

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
			toggleGroup: tenses =>
				set(state => {
					const allSelected = tenses.every(tense => state.selectedTenses.includes(tense));
					return {
						selectedTenses: allSelected
							? state.selectedTenses.filter(t => !tenses.includes(t))
							: [...state.selectedTenses, ...tenses.filter(t => !state.selectedTenses.includes(t))],
					};
				}),
		}),
		{
			name: 'tense-settings',
			partialize: state => ({
				selectedTenses: state.selectedTenses,
				mode: state.mode,
				fixedLimit: state.fixedLimit,
			}),
		},
	),
);
