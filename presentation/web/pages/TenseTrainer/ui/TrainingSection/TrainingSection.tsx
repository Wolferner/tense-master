'use client';

import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Textarea } from '@/presentation/components/ui/textarea';
import { TENSE_LABELS } from '@/presentation/web/pages/TenseTrainer/logic/tenseLabels';
import { selectTrainingSection } from '@/shared/stores/useTenseStore/tenseStoreSelectors';
import { useTenseStore } from '@/shared/stores/useTenseStore/useTenseStore';
import { ArrowLeftIcon } from 'lucide-react';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import TaskResult from './TaskResult';

const TrainingSection = () => {
	const {
		sessionId,
		mode,
		exercises,
		currentExerciseIndex,
		isLoading,
		answers,
		setStep,
		nextExercise,
		submitAnswer,
	} = useTenseStore(useShallow(selectTrainingSection));

	const current = exercises[currentExerciseIndex];
	const totalExercises = exercises.length;
	const answerRecord = answers[current.id]?.findLast(a => a.sessionId === sessionId);

	const [userAnswer, setUserAnswer] = useState(answerRecord?.answer ?? '');

	const indexString =
		mode === 'infinite'
			? `# ${currentExerciseIndex + 1}`
			: `${currentExerciseIndex + 1} / ${totalExercises}`;

	const isEmptyAnswer = userAnswer.trim().length === 0;

	return (
		<main className='bg-background text-foreground flex flex-1 flex-col'>
			<div className='mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16'>
				<Button variant='ghost' size='sm' className='-ml-2 w-fit' onClick={() => setStep('select')}>
					<ArrowLeftIcon />
					Назад
				</Button>

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
							placeholder='Введи перевод на английском...'
							value={userAnswer}
							onChange={e => setUserAnswer(e.target.value)}
							disabled={!!answerRecord}
							rows={3}
						/>
						{!answerRecord && (
							<Button
								onClick={() => submitAnswer(userAnswer, current.id)}
								variant={isEmptyAnswer ? 'outline' : 'default'}
							>
								{isEmptyAnswer ? 'Skip' : 'Проверить'}
							</Button>
						)}
					</div>

					{!!answerRecord && (
						<TaskResult
							current={current}
							isLoading={isLoading}
							mode={mode}
							currentIndex={currentExerciseIndex}
							totalExercises={totalExercises}
							onNext={() => {
								setUserAnswer('');
								nextExercise();
							}}
						/>
					)}
				</div>
			</div>
		</main>
	);
};

export default TrainingSection;
