'use client';

import { exerciseSessionService } from '@/client/infrastructure/container';
import type { ExerciseAnswer } from '@/domain/entities/Answer';
import type { TenseType } from '@/domain/value-objects';
import type { ExerciseResponseDto } from '@/shared/dtos';
import type { FixedLimit, Step, TrainingMode } from '@/shared/config/training';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SessionState = {
	exercises: ExerciseResponseDto[];
	currentAnswer: ExerciseAnswer | null;
	sessionId: string;
	step: Step;
	currentExerciseIndex: number;
	isLoading: boolean;
};

type SessionActions = {
	setStep(step: Step): void;
	submitAnswer(answer: string, exerciseId: string): Promise<void>;
	startTraining(tenses: TenseType[], mode: TrainingMode, fixedLimit: FixedLimit): Promise<void>;
	nextExercise(tenses: TenseType[], mode: TrainingMode): Promise<void>;
};

export type SessionStore = SessionState & SessionActions;

export const useSessionStore = create<SessionStore>()(
	persist(
		(set, get) => ({
			exercises: [],
			currentAnswer: null,
			sessionId: '',
			step: 'select',
			currentExerciseIndex: 0,
			isLoading: false,

			setStep: step => set({ step }),

			submitAnswer: async (answer, exerciseId) => {
				const { exercises, sessionId } = get();
				const exercise = exercises.find(e => e.id === exerciseId);
				if (!exercise) return;
				const record = await exerciseSessionService.saveAnswer(exercise, answer, sessionId);
				set({ currentAnswer: record });
			},

			startTraining: async (tenses, mode, fixedLimit) => {
				if (tenses.length === 0) return;
				set({ isLoading: true });
				const { exercises, sessionId } = await exerciseSessionService.beginSession(
					tenses,
					mode,
					fixedLimit,
				);
				set({
					exercises,
					sessionId,
					currentExerciseIndex: 0,
					currentAnswer: null,
					step: 'training',
					isLoading: false,
				});
			},

			nextExercise: async (tenses, mode) => {
				const { currentExerciseIndex, exercises, sessionId } = get();
				set({ isLoading: true });
				const result = await exerciseSessionService.resolveNext(
					currentExerciseIndex,
					exercises,
					tenses,
					mode,
				);
				if (result.type === 'advance') {
					set({ currentExerciseIndex: result.nextIndex, currentAnswer: null, isLoading: false });
				} else if (result.type === 'complete') {
					await exerciseSessionService.completeSession(sessionId);
					set({ step: 'select', currentAnswer: null, isLoading: false });
				} else {
					set(prev => ({
						exercises: [...prev.exercises, ...result.exercises],
						currentExerciseIndex: result.nextIndex,
						currentAnswer: null,
						isLoading: false,
					}));
				}
			},
		}),
		{
			name: 'tense-session',
			partialize: state => ({
				exercises: state.exercises,
				sessionId: state.sessionId,
				step: state.step,
				currentExerciseIndex: state.currentExerciseIndex,
				currentAnswer: state.currentAnswer,
			}),
		},
	),
);
