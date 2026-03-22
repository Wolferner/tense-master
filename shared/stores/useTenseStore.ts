'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tense, TenseType } from '@/server/domain/value-objects';

export type SessionMode = 'fixed' | 'infinite';
export const FIXED_LIMITS = [5, 10, 20] as const;
export type FixedLimit = (typeof FIXED_LIMITS)[number];

interface TenseStore {
	selectedTenses: TenseType[];
	mode: SessionMode;
	fixedLimit: FixedLimit;
	toggleTense: (tense: TenseType) => void;
	selectAll: () => void;
	clearAll: () => void;
	setTenses: (tenses: TenseType[]) => void;
	setMode: (mode: SessionMode) => void;
	setFixedLimit: (limit: FixedLimit) => void;
}

const ALL_TENSES = Object.values(Tense) as TenseType[];

export const useTenseStore = create<TenseStore>()(
	persist(
		set => ({
			selectedTenses: ALL_TENSES,
			mode: 'fixed',
			fixedLimit: 10,
			toggleTense: tense =>
				set(state => ({
					selectedTenses: state.selectedTenses.includes(tense)
						? state.selectedTenses.filter(t => t !== tense)
						: [...state.selectedTenses, tense],
				})),
			selectAll: () => set({ selectedTenses: ALL_TENSES }),
			clearAll: () => set({ selectedTenses: [] }),
			setTenses: tenses => set({ selectedTenses: tenses }),
			setMode: mode => set({ mode }),
			setFixedLimit: fixedLimit => set({ fixedLimit }),
		}),
		{ name: 'tense-settings' },
	),
);
