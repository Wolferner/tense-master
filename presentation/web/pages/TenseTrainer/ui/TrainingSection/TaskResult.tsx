import { type ExerciseAnswer } from '@/domain/entities/Answer';
import { Button } from '@/presentation/components/ui/button';
import { type TrainingMode } from '@/shared/config/training';
import { type ExerciseResponseDto } from '@/shared/dtos';
import { cn } from '@/shared/lib/utils';
import { CheckIcon, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface TaskResultProps {
	current: ExerciseResponseDto;
	answerRecord: ExerciseAnswer;
	isLoading: boolean;
	mode: TrainingMode;
	currentIndex: number;
	totalExercises: number;
	onNext: () => void;
}

const TaskResult = ({
	current,
	answerRecord,
	isLoading,
	mode,
	currentIndex,
	totalExercises,
	onNext,
}: TaskResultProps) => {
	const t = useTranslations('trainer');
	const tCommon = useTranslations('common');

	const buttonText = isLoading
		? tCommon('loading')
		: mode === 'infinite' || currentIndex + 1 < totalExercises
			? t('next')
			: t('finish');

	const showResult = !answerRecord.skipped;
	const showCorrectAnswer = answerRecord.skipped || !answerRecord.isCorrect;

	return (
		<div className='animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-4 duration-200'>
			{showResult && (
				<div
					className={cn(
						'flex items-center gap-3 rounded-xl border p-4',
						answerRecord.isCorrect
							? 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400'
							: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
					)}
				>
					{answerRecord.isCorrect ? (
						<CheckIcon className='size-5 shrink-0' />
					) : (
						<XIcon className='size-5 shrink-0' />
					)}
					<span className='text-sm font-medium'>
						{answerRecord.isCorrect ? t('correct') : t('incorrect')}
					</span>
				</div>
			)}
			{showCorrectAnswer && (
				<>
					<div className='border-border bg-card rounded-xl border p-6'>
						<p className='text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase'>
							{t('correctAnswer')}
						</p>
						<p className='text-foreground'>{current.answer}</p>
					</div>
					<div className='border-border bg-card rounded-xl border p-6'>
						<p className='text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase'>
							{t('whyThisTense')}
						</p>
						<p className='text-foreground text-sm leading-relaxed'>{current.explanation}</p>
					</div>
				</>
			)}
			<Button onClick={onNext} disabled={isLoading}>
				{buttonText}
			</Button>
		</div>
	);
};

export default TaskResult;
