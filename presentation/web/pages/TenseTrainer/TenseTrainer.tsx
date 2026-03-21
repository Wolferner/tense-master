'use client';

import { useCallback, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ExerciseResponseDto } from '@/server/aplication/exercise';
import { Tense, TenseType } from '@/server/domain/value-objects';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Textarea } from '@/presentation/components/ui/textarea';
import { TENSE_LABELS } from '@/shared/config/tenseLabels';
import { FIXED_LIMITS, FixedLimit, SessionMode, useTenseStore } from '@/shared/stores/useTenseStore';

type Step = 'select' | 'training' | 'result';

const ALL_TENSES = Object.values(Tense) as TenseType[];

const MODE_LABELS: Record<SessionMode, string> = {
	fixed: 'Фиксированное количество',
	infinite: 'Бесконечный режим',
};

async function fetchExercises(tenses: TenseType[], limit: number): Promise<ExerciseResponseDto[]> {
	const params = new URLSearchParams({ tenses: tenses.join(','), limit: String(limit) });
	const res = await fetch(`/api/excersises?${params}`);
	return res.json();
}

const TenseTrainer = () => {
	const { selectedTenses, toggleTense, selectAll, clearAll, mode, fixedLimit, setMode, setFixedLimit } =
		useTenseStore();

	const [step, setStep] = useState<Step>('select');
	const [exercises, setExercises] = useState<ExerciseResponseDto[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [userAnswer, setUserAnswer] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const current = exercises[currentIndex];

	const startTraining = useCallback(async () => {
		if (selectedTenses.length === 0) return;
		setIsLoading(true);
		const data = await fetchExercises(selectedTenses, mode === 'fixed' ? fixedLimit : 10);
		setExercises(data);
		setCurrentIndex(0);
		setUserAnswer('');
		setStep('training');
		setIsLoading(false);
	}, [selectedTenses, mode, fixedLimit]);

	const checkAnswer = () => setStep('result');

	const nextExercise = useCallback(async () => {
		if (mode === 'infinite') {
			setIsLoading(true);
			const data = await fetchExercises(selectedTenses, 1);
			setExercises(prev => [...prev, ...data]);
			setCurrentIndex(i => i + 1);
			setUserAnswer('');
			setStep('training');
			setIsLoading(false);
			return;
		}

		if (currentIndex + 1 < exercises.length) {
			setCurrentIndex(i => i + 1);
			setUserAnswer('');
			setStep('training');
		} else {
			setStep('select');
		}
	}, [mode, currentIndex, exercises.length, selectedTenses]);

	if (step === 'select') {
		return (
			<main className='min-h-screen overflow-hidden bg-background text-foreground'>
				<div className='animate-in fade-in slide-in-from-bottom-4 duration-300 mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-16'>
					<div className='flex items-center justify-between'>
						<div>
							<h1 className='text-3xl font-bold text-foreground'>Tense Trainer</h1>
							<p className='mt-2 text-muted-foreground'>Выбери времена для тренировки</p>
						</div>
						{exercises.length > 0 && (
							<Button variant='ghost' size='sm' onClick={() => setStep('training')}>
								Продолжить
								<ArrowRight />
							</Button>
						)}
					</div>

					<div className='flex flex-col gap-3 rounded-xl border border-border bg-card p-5'>
						<p className='text-sm font-semibold text-foreground'>Режим</p>
						<div className='flex gap-2'>
							{(['fixed', 'infinite'] as SessionMode[]).map(m => (
								<button
									key={m}
									onClick={() => setMode(m)}
									className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
										mode === m
											? 'border-primary bg-primary text-primary-foreground'
											: 'border-border bg-background text-muted-foreground hover:bg-muted'
									}`}
								>
									{MODE_LABELS[m]}
								</button>
							))}
						</div>
						{mode === 'fixed' && (
							<div className='flex gap-2'>
								{FIXED_LIMITS.map(limit => (
									<button
										key={limit}
										onClick={() => setFixedLimit(limit as FixedLimit)}
										className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
											fixedLimit === limit
												? 'border-primary bg-primary text-primary-foreground'
												: 'border-border bg-background text-muted-foreground hover:bg-muted'
										}`}
									>
										{limit}
									</button>
								))}
							</div>
						)}
					</div>

					<div className='flex gap-3'>
						<Button variant='outline' size='sm' onClick={selectAll}>
							Выбрать все
						</Button>
						<Button variant='outline' size='sm' onClick={clearAll}>
							Сбросить
						</Button>
					</div>

					<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
						{ALL_TENSES.map(tense => (
							<label
								key={tense}
								className='flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted'
							>
								<Checkbox
									checked={selectedTenses.includes(tense)}
									onCheckedChange={() => toggleTense(tense)}
								/>
								<span className='text-sm font-medium text-foreground'>{TENSE_LABELS[tense]}</span>
							</label>
						))}
					</div>

					<Button size='lg' onClick={startTraining} disabled={selectedTenses.length === 0 || isLoading}>
						{isLoading ? 'Загрузка...' : exercises.length > 0 ? 'Начать заново' : 'Начать'}
					</Button>
				</div>
			</main>
		);
	}

	if (!current) return null;

	return (
		<main className='min-h-screen bg-background text-foreground'>
			<div className='mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-16'>
				<Button variant='ghost' size='sm' className='-ml-2 w-fit' onClick={() => setStep('select')}>
					<ArrowLeft />
					Назад
				</Button>

				<div
					key={currentIndex}
					className='animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col gap-8'
				>
					<div className='flex items-center justify-between'>
						<Badge variant='outline'>{TENSE_LABELS[current.tense]}</Badge>
						<span className='text-sm text-muted-foreground'>
							{mode === 'infinite' ? `# ${currentIndex + 1}` : `${currentIndex + 1} / ${exercises.length}`}
						</span>
					</div>

					<div className='rounded-xl border border-border bg-card p-6'>
						<p className='text-lg font-medium text-foreground'>{current.question}</p>
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
								onClick={checkAnswer}
								variant={userAnswer.trim().length === 0 ? 'outline' : 'default'}
							>
								{userAnswer.trim().length === 0 ? 'Skip' : 'Проверить'}
							</Button>
						)}
					</div>

					{step === 'result' && (
						<div className='animate-in fade-in slide-in-from-bottom-2 duration-200 flex flex-col gap-4'>
							<div className='rounded-xl border border-border bg-card p-6'>
								<p className='mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
									Правильный ответ
								</p>
								<p className='text-foreground'>{current.answer}</p>
							</div>
							<div className='rounded-xl border border-border bg-card p-6'>
								<p className='mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
									Почему это время
								</p>
								<p className='text-sm leading-relaxed text-foreground'>{current.explanation}</p>
							</div>
							<Button onClick={nextExercise} disabled={isLoading}>
								{isLoading
									? 'Загрузка...'
									: mode === 'infinite' || currentIndex + 1 < exercises.length
										? 'Следующее'
										: 'Завершить'}
							</Button>
						</div>
					)}
				</div>
			</div>
		</main>
	);
};

export default TenseTrainer;
