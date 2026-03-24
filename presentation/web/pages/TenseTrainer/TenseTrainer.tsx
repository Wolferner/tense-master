'use client';

import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Textarea } from '@/presentation/components/ui/textarea';
import { ExerciseResponseDto } from '@/server/aplication/exercise';
import { TENSE_GROUPS, TENSE_LABELS } from '@/shared/config/tenseLabels';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useState } from 'react';

import { useTenseStore } from '@/shared/stores/useTenseStore';
import { fetchExercises } from './api/fetchExercises';
import { FIXED_LIMITS, FixedLimit, MODE_LABELS, SessionMode, Step } from './logic/types';

const TenseTrainer = () => {
	const {
		selectedTenses,
		toggleTense,
		selectAll,
		clearAll,
		mode,
		fixedLimit,
		setMode,
		setFixedLimit,
		setTenses,
	} = useTenseStore();

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
			<main className='bg-background text-foreground flex flex-1 flex-col overflow-hidden'>
				<div className='animate-in fade-in slide-in-from-bottom-4 mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16 duration-300'>
					<div className='flex items-center justify-between'>
						<div>
							<h1 className='text-foreground text-3xl font-bold'>Tense Trainer</h1>
							<p className='text-muted-foreground mt-2'>Выбери времена для тренировки</p>
						</div>
						{exercises.length > 0 && (
							<Button variant='ghost' size='sm' onClick={() => setStep('training')}>
								Продолжить
								<ArrowRight />
							</Button>
						)}
					</div>

					<div className='border-border bg-card flex flex-col gap-3 rounded-xl border p-5'>
						<p className='text-foreground text-sm font-semibold'>Режим</p>
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
						<div
							className={`grid transition-all duration-200 ease-in-out ${
								mode === 'fixed' ? 'grid-rows-[1fr]' : '-mt-3 grid-rows-[0fr]'
							}`}
						>
							<div className='overflow-hidden'>
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
							</div>
						</div>
					</div>

					<div className='flex gap-3'>
						<Button variant='outline' size='sm' onClick={selectAll}>
							Выбрать все
						</Button>
						<Button variant='outline' size='sm' onClick={clearAll}>
							Сбросить
						</Button>
					</div>

					<div className='flex flex-col gap-6'>
						{TENSE_GROUPS.map(group => {
							const allSelected = group.tenses.every(t => selectedTenses.includes(t));
							const someSelected = group.tenses.some(t => selectedTenses.includes(t));

							const toggleGroup = () => {
								if (allSelected) {
									setTenses(selectedTenses.filter(t => !group.tenses.includes(t)));
								} else {
									setTenses([...new Set([...selectedTenses, ...group.tenses])]);
								}
							};

							return (
								<div key={group.label} className='flex flex-col gap-2'>
									<div className='flex items-center justify-between'>
										<span className='text-foreground text-sm font-semibold'>{group.label}</span>
										<button onClick={toggleGroup} className='text-primary text-xs hover:underline'>
											{allSelected ? 'Снять' : someSelected ? 'Выбрать все' : 'Выбрать все'}
										</button>
									</div>
									<div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
										{group.tenses.map(tense => (
											<label
												key={tense}
												className='border-border bg-card hover:bg-muted flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors'
											>
												<Checkbox
													checked={selectedTenses.includes(tense)}
													onCheckedChange={() => toggleTense(tense)}
												/>
												<span className='text-foreground text-sm font-medium'>
													{TENSE_LABELS[tense]}
												</span>
											</label>
										))}
									</div>
								</div>
							);
						})}
					</div>

					<Button
						size='lg'
						onClick={startTraining}
						disabled={selectedTenses.length === 0 || isLoading}
					>
						{isLoading ? 'Загрузка...' : exercises.length > 0 ? 'Начать заново' : 'Начать'}
					</Button>
				</div>
			</main>
		);
	}

	if (!current) return null;

	return (
		<main className='bg-background text-foreground flex flex-1 flex-col'>
			<div className='mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16'>
				<Button variant='ghost' size='sm' className='-ml-2 w-fit' onClick={() => setStep('select')}>
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
								: `${currentIndex + 1} / ${exercises.length}`}
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
								onClick={checkAnswer}
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
