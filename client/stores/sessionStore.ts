'use client';

import { exerciseSessionService } from '@/client/infrastructure/api/ExerciseApiRepository/container';
import { type ExerciseAnswer } from '@/domain/entities/Answer';
import { type TenseType } from '@/domain/value-objects';
import { type ExerciseResponseDto } from '@/shared/dtos';
import type { FixedLimit, Step, TrainingMode } from '@/shared/config/training';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SessionState = {
	exercises: ExerciseResponseDto[];
	answers: Record<string, ExerciseAnswer[]>;
	sessionId: string;
	step: Step;
	currentExerciseIndex: number;
	isLoading: boolean;
};

type SessionActions = {
	setStep(step: Step): void;
	submitAnswer(answer: ExerciseAnswer['answer'], exerciseId: ExerciseResponseDto['id']): void;
	startTraining(tenses: TenseType[], mode: TrainingMode, fixedLimit: FixedLimit): Promise<void>;
	nextExercise(tenses: TenseType[], mode: TrainingMode): Promise<void>;
};

export type SessionStore = SessionState & SessionActions;

export const useSessionStore = create<SessionStore>()(
	persist(
		(set, get) => ({
			exercises: [],
			answers: {},
			sessionId: '',
			step: 'select',
			currentExerciseIndex: 0,
			isLoading: false,

			setStep: step => set({ step }),

			submitAnswer: (answer, exerciseId) => {
				const { exercises, sessionId } = get();
				const exercise = exercises.find(e => e.id === exerciseId);
				if (!exercise) return;
				const record = exerciseSessionService.createAnswer(exercise, answer, sessionId);
				set(state => ({
					answers: {
						...state.answers,
						[exerciseId]: [...(state.answers[exerciseId] || []), record],
					},
				}));
			},

			startTraining: async (tenses, mode, fixedLimit) => {
				if (tenses.length === 0) return;
				set({ isLoading: true });
				const exercises = await exerciseSessionService.loadExercises(tenses, mode, fixedLimit);
				set({
					exercises,
					sessionId: crypto.randomUUID(),
					currentExerciseIndex: 0,
					step: 'training',
					isLoading: false,
				});
			},

			nextExercise: async (tenses, mode) => {
				const { currentExerciseIndex, exercises } = get();
				set({ isLoading: true });
				const result = await exerciseSessionService.resolveNext(
					currentExerciseIndex,
					exercises,
					tenses,
					mode,
				);
				if (result.type === 'advance') {
					set({ currentExerciseIndex: result.nextIndex, isLoading: false });
				} else if (result.type === 'complete') {
					set({ step: 'select', isLoading: false });
				} else {
					set(prev => ({
						exercises: [...prev.exercises, ...result.exercises],
						currentExerciseIndex: result.nextIndex,
						isLoading: false,
					}));
				}
			},
		}),
		{
			name: 'tense-session',
			partialize: state => ({
				exercises: state.exercises,
				answers: state.answers,
				sessionId: state.sessionId,
				step: state.step,
				currentExerciseIndex: state.currentExerciseIndex,
			}),
		},
	),
);
