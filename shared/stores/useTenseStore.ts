'use client';

import type { FixedLimit, SessionMode } from '@/presentation/web/pages/TenseTrainer/logic/types';
import { TenseType } from '@/server/domain/value-objects';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_TENSES } from '../config/storeDefaults';

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

export const useTenseStore = create<TenseStore>()(
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
			setTenses: tenses => set({ selectedTenses: tenses }),
			setMode: mode => set({ mode }),
			setFixedLimit: fixedLimit => set({ fixedLimit }),
		}),
		{ name: 'tense-settings' },
	),
);
