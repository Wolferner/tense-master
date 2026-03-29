import { Button } from '@/presentation/components/ui/button';
import { type ExerciseResponseDto } from '@/server/aplication/exercise';
import { type TrainingMode } from '../../logic/config';

interface TaskResultProps {
	current: ExerciseResponseDto;
	isLoading: boolean;
	mode: TrainingMode;
	currentIndex: number;
	totalExercises: number;
	onNext: () => void;
}

const TaskResult = ({
	current,
	isLoading,
	mode,
	currentIndex,
	totalExercises,
	onNext,
}: TaskResultProps) => {
	const buttonText = isLoading
		? 'Загрузка...'
		: mode === 'infinite' || currentIndex + 1 < totalExercises
			? 'Следующее'
			: 'Завершить';
	return (
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
				{buttonText}
			</Button>
		</div>
	);
};

export default TaskResult;
