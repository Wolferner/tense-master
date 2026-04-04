'use client';

import { fetchExercises } from '@/client/infrastructure/api/fetchExercises';
import { validateAnswer } from '@/domain/services/AnswerValidator';
import { type ExerciseAnswer } from '@/domain/entities/Answer';
import { type TenseType } from '@/domain/value-objects';
import { type ExerciseResponseDto } from '@/server/aplication/exercise';
import { INFINITE_MODE_LIMIT, MAX_EXERCISES } from '@/shared/config/constants';
import type {
	FixedLimit,
	Step,
	TrainingMode,
} from '@/presentation/web/pages/TenseTrainer/logic/config';
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

			startTraining: async (tenses, mode, fixedLimit) => {
				if (tenses.length === 0) return;

				set({ isLoading: true });

				const newExercises = await fetchExercises(
					tenses,
					mode === 'fixed' ? fixedLimit : MAX_EXERCISES,
				);

				set({
					exercises: newExercises,
					sessionId: crypto.randomUUID(),
					currentExerciseIndex: 0,
					step: 'training',
					isLoading: false,
				});
			},

			nextExercise: async (tenses, mode) => {
				const { currentExerciseIndex, exercises } = get();

				if (currentExerciseIndex + 1 < exercises.length) {
					set({ currentExerciseIndex: currentExerciseIndex + 1 });
					return;
				}

				if (mode === 'fixed') {
					set({ step: 'select' });
					return;
				}

				set({ isLoading: true });
				const data = await fetchExercises(tenses, INFINITE_MODE_LIMIT);
				set(prev => ({
					exercises: [...prev.exercises, ...data],
					currentExerciseIndex: prev.currentExerciseIndex + 1,
					isLoading: false,
				}));
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
