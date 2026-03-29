'use client';

import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Textarea } from '@/presentation/components/ui/textarea';
import { ExerciseResponseDto } from '@/server/aplication/exercise';
import { TENSE_LABELS } from '@/shared/config/tenseLabels';
import { ArrowLeft } from 'lucide-react';
import { Step, TrainingMode } from '../logic/types';

type Props = {
	current: ExerciseResponseDto;
	currentIndex: number;
	totalExercises: number;
	mode: TrainingMode;
	step: Exclude<Step, 'select'>;
	userAnswer: string;
	setUserAnswer: (v: string) => void;
	isLoading: boolean;
	onBack: () => void;
	onCheck: () => void;
	onNext: () => void;
};

const TrainingStep = ({
	current,
	currentIndex,
	totalExercises,
	mode,
	step,
	userAnswer,
	setUserAnswer,
	isLoading,
	onBack,
	onCheck,
	onNext,
}: Props) => (
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
					<div className='animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-4 duration-200'>
						<div className='border-border bg-card rounded-xl border p-6'>
							<p className='text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase'>
								Правильный ответ
							</p>
							<p className='text-foreground'>{current.answer}</p>
						</div>
						<div className='border-border bg-card rounded-xl border p-6'>
							<p className='text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase'>
								Почему это время
							</p>
							<p className='text-foreground text-sm leading-relaxed'>{current.explanation}</p>
						</div>
						<Button onClick={onNext} disabled={isLoading}>
							{isLoading
								? 'Загрузка...'
								: mode === 'infinite' || currentIndex + 1 < totalExercises
									? 'Следующее'
									: 'Завершить'}
						</Button>
					</div>
				)}
			</div>
		</div>
	</main>
);

export default TrainingStep;
