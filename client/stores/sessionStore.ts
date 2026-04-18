'use client';

import { exerciseSessionService, exerciseSyncService } from '@/client/infrastructure/container';
import type { ExerciseAnswer } from '@/domain/entities/Answer';
import type { Locale, TenseType } from '@/domain/value-objects';
import type { FixedLimit, Step, TrainingMode } from '@/shared/config/training';
import type { ExerciseResponseDto } from '@/shared/dtos';
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
	submitAnswer(answer: string, exerciseId: string, locale: Locale): Promise<void>;
	startTraining(
		tenses: TenseType[],
		mode: TrainingMode,
		fixedLimit: FixedLimit,
		locale: Locale,
	): Promise<void>;
	nextExercise(tenses: TenseType[], mode: TrainingMode, locale: Locale): Promise<void>;
	finishSession(): Promise<void>;
	syncExercises(locale: Locale): Promise<void>;
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

			syncExercises: async locale => {
				set({ isLoading: true });
				await exerciseSyncService.sync(locale);
				set({ isLoading: false });
			},

			finishSession: async () => {
				const { sessionId } = get();
				if (sessionId) await exerciseSessionService.completeSession(sessionId);
				set({
					step: 'select',
					currentAnswer: null,
					sessionId: '',
					exercises: [],
					currentExerciseIndex: 0,
				});
			},

			submitAnswer: async (answer, exerciseId, locale) => {
				const { exercises, sessionId } = get();
				const exercise = exercises.find(e => e.id === exerciseId);
				if (!exercise) return;
				const record = await exerciseSessionService.saveAnswer(exercise, answer, sessionId, locale);
				set({ currentAnswer: record });
			},

			startTraining: async (tenses, mode, fixedLimit, locale) => {
				if (tenses.length === 0) return;
				set({ isLoading: true });
				const { exercises, sessionId } = await exerciseSessionService.beginSession(
					tenses,
					mode,
					fixedLimit,
					locale,
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

			nextExercise: async (tenses, mode, locale) => {
				const { currentExerciseIndex, exercises, sessionId } = get();
				set({ isLoading: true });
				const result = await exerciseSessionService.resolveNext(
					currentExerciseIndex,
					exercises,
					tenses,
					mode,
					locale,
				);
				if (result.type === 'advance') {
					set({ currentExerciseIndex: result.nextIndex, currentAnswer: null, isLoading: false });
				} else if (result.type === 'complete') {
					await exerciseSessionService.completeSession(sessionId);
					set({
						step: 'select',
						currentAnswer: null,
						exercises: [],
						currentExerciseIndex: 0,
						sessionId: '',
						isLoading: false,
					});
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
