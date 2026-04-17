'use client';

import { useSessionStore } from '@/client/stores/sessionStore';
import { useSettingsStore } from '@/client/stores/settingsStore';
import { LocaleType } from '@/domain/value-objects';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Textarea } from '@/presentation/components/ui/textarea';
import { TENSE_LABELS } from '@/presentation/web/pages/TenseTrainer/logic/tenseLabels';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import TaskResult from './TaskResult';

const TrainingSection = () => {
	const t = useTranslations('trainer');
	const tCommon = useTranslations('common');
	const locale = useLocale();

	const {
		exercises,
		currentExerciseIndex,
		isLoading,
		currentAnswer,
		setStep,
		nextExercise,
		submitAnswer,
		finishSession,
	} = useSessionStore(
		useShallow(s => ({
			exercises: s.exercises,
			currentExerciseIndex: s.currentExerciseIndex,
			isLoading: s.isLoading,
			currentAnswer: s.currentAnswer,
			setStep: s.setStep,
			nextExercise: s.nextExercise,
			submitAnswer: s.submitAnswer,
			finishSession: s.finishSession,
		})),
	);

	const { mode, selectedTenses } = useSettingsStore(
		useShallow(s => ({ mode: s.mode, selectedTenses: s.selectedTenses })),
	);

	const current = exercises[currentExerciseIndex];
	const totalExercises = exercises.length;
	const answerRecord = currentAnswer?.exerciseId === current.id ? currentAnswer : null;

	const [userAnswer, setUserAnswer] = useState(answerRecord?.userAnswer ?? '');

	const indexString =
		mode === 'infinite'
			? `# ${currentExerciseIndex + 1}`
			: `${currentExerciseIndex + 1} / ${totalExercises}`;

	const isEmptyAnswer = userAnswer.trim().length === 0;

	return (
		<main className='bg-background text-foreground flex flex-1 flex-col'>
			<div className='mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16'>
				<div className='flex items-center justify-between'>
					<Button variant='ghost' size='sm' className='-ml-2' onClick={() => setStep('select')}>
						<ArrowLeftIcon />
						{t('back')}
					</Button>
					{mode === 'infinite' && (
						<Button
							variant='ghost'
							size='sm'
							className='-mr-2'
							onClick={() => void finishSession()}
						>
							{t('finish')}
							<ArrowRightIcon />
						</Button>
					)}
				</div>

				<div
					key={currentExerciseIndex}
					className='animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-8 duration-300'
				>
					<div className='flex items-center justify-between'>
						{!!answerRecord ? (
							<Badge variant='outline'>{TENSE_LABELS[current.tense]}</Badge>
						) : (
							<div />
						)}
						<span className='text-muted-foreground text-sm'>{indexString}</span>
					</div>

					<div className='border-border bg-card rounded-xl border p-6'>
						<p className='text-foreground text-lg font-medium'>{current.question}</p>
					</div>

					<div className='flex flex-col gap-3'>
						<Textarea
							placeholder={t('inputPlaceholder')}
							value={userAnswer}
							onChange={e => setUserAnswer(e.target.value)}
							disabled={!!answerRecord}
							rows={3}
						/>
						{!answerRecord && (
							<Button
								onClick={() => void submitAnswer(userAnswer, current.id, locale as LocaleType)}
								variant={isEmptyAnswer ? 'outline' : 'default'}
							>
								{isEmptyAnswer ? t('skip') : t('check')}
							</Button>
						)}
					</div>

					{!!answerRecord && (
						<TaskResult
							current={current}
							answerRecord={answerRecord}
							isLoading={isLoading}
							mode={mode}
							currentIndex={currentExerciseIndex}
							totalExercises={totalExercises}
							onNext={() => {
								setUserAnswer('');
								nextExercise(selectedTenses, mode);
							}}
						/>
					)}
				</div>
			</div>
		</main>
	);
};

export default TrainingSection;
