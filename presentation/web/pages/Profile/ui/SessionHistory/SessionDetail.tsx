import type { AnswerWithExercise } from '@/client/application/services/ProfileService';
import { TENSE_LABELS } from '@/presentation/web/pages/TenseTrainer/logic/tenseLabels';

interface Props {
	answers: AnswerWithExercise[];
}

export function SessionDetail({ answers }: Props) {
	if (answers.length === 0) {
		return <p className='text-muted-foreground py-2 text-sm'>Нет ответов</p>;
	}

	return (
		<div className='flex flex-col gap-2 pt-2'>
			{answers.map(a => (
				<div key={a.id} className='border-border bg-background rounded-lg border p-3'>
					<div className='mb-1 flex items-center justify-between'>
						<span className='text-muted-foreground text-xs'>{TENSE_LABELS[a.exercise.tense]}</span>
						{a.skipped ? (
							<span className='text-muted-foreground text-xs'>Пропущено</span>
						) : (
							<span
								className={`text-xs font-medium ${a.isCorrect ? 'text-green-600' : 'text-red-500'}`}
							>
								{a.isCorrect ? 'Верно' : 'Неверно'}
							</span>
						)}
					</div>
					<p className='text-foreground text-sm'>{a.exercise.question}</p>
					{!a.skipped && (
						<p className='text-muted-foreground mt-1 text-xs'>
							Ответ: <span className='text-foreground'>{a.userAnswer}</span>
						</p>
					)}
				</div>
			))}
		</div>
	);
}
