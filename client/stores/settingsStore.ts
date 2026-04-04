'use client';

import { Tense, type TenseType } from '@/domain/value-objects';
import type { FixedLimit, TrainingMode } from '@/presentation/web/pages/TenseTrainer/logic/config';
import type { ITenseGroup } from '@/presentation/web/pages/TenseTrainer/logic/tenseLabels';
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
	toggleGroup(group: ITenseGroup): void;
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
			toggleGroup: group =>
				set(state => {
					const allSelected = group.tenses.every(tense => state.selectedTenses.includes(tense));
					return {
						selectedTenses: allSelected
							? state.selectedTenses.filter(t => !group.tenses.includes(t))
							: [
									...state.selectedTenses,
									...group.tenses.filter(t => !state.selectedTenses.includes(t)),
								],
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
