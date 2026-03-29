'use client';

import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Textarea } from '@/presentation/components/ui/textarea';
import { ExerciseResponseDto } from '@/server/aplication/exercise';
import { TENSE_LABELS } from '@/shared/config/tenseLabels';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Step, TrainingMode } from '../../logic/types';
import TaskResult from './TaskResult';

type Props = {
	exercises: ExerciseResponseDto[];
	currentIndex: number;
	mode: TrainingMode;
	step: Exclude<Step, 'select'>;
	isLoading: boolean;
	onBack: () => void;
	onCheck: () => void;
	onNext: () => void;
};

const TrainingStep = ({
	exercises,
	currentIndex,
	mode,
	step,
	isLoading,
	onBack,
	onCheck,
	onNext,
}: Props) => {
	const [userAnswer, setUserAnswer] = useState('');

	const current = exercises[currentIndex];
	const totalExercises = exercises.length;

	return (
		<main className='bg-background text-foreground flex flex-1 flex-col'>
			<div className='mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16'>
				<Button variant='ghost' size='sm' className='-ml-2 w-fit' onClick={onBack}>
					<ArrowLeft />
					Назад
				</Button>

				<div
					key={currentIndex}
					className='animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-8 duration-300'
				>
					<div className='flex items-center justify-between'>
						{step === 'result' ? (
							<Badge variant='outline'>{TENSE_LABELS[current.tense]}</Badge>
						) : (
							<div />
						)}
						<span className='text-muted-foreground text-sm'>
							{mode === 'infinite'
								? `# ${currentIndex + 1}`
								: `${currentIndex + 1} / ${totalExercises}`}
						</span>
					</div>

					<div className='border-border bg-card rounded-xl border p-6'>
						<p className='text-foreground text-lg font-medium'>{current.question}</p>
					</div>

					<div className='flex flex-col gap-3'>
						<Textarea
							placeholder='Введи перевод на английском...'
							value={userAnswer}
							onChange={e => setUserAnswer(e.target.value)}
							disabled={step === 'result'}
							rows={3}
						/>
						{step === 'training' && (
							<Button
								onClick={onCheck}
								variant={userAnswer.trim().length === 0 ? 'outline' : 'default'}
							>
								{userAnswer.trim().length === 0 ? 'Skip' : 'Проверить'}
							</Button>
						)}
					</div>

					{step === 'result' && (
						<TaskResult
							current={current}
							isLoading={isLoading}
							mode={mode}
							currentIndex={currentIndex}
							totalExercises={totalExercises}
							onNext={onNext}
						/>
					)}
				</div>
			</div>
		</main>
	);
};

export default TrainingStep;
