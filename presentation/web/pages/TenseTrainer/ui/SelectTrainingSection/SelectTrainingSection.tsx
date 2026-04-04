'use client';

import { selectSelectSection, useTenseStore } from '@/client/stores/useTenseStore';
import { Button } from '@/presentation/components/ui/button';
import { TENSE_GROUPS } from '@/presentation/web/pages/TenseTrainer/logic/tenseLabels';
import { ArrowRightIcon } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import ModeSelector from './ModeSelector';
import TenseGroup from './TenseGroup';

const SelectTrainingSection = () => {
	const {
		selectedTenses,
		mode,
		fixedLimit,
		exercises,
		isLoading,
		toggleTense,
		selectAll,
		clearAll,
		toggleGroup,
		updateMode,
		setStep,
		startTraining,
	} = useTenseStore(useShallow(selectSelectSection));

	const hasExercises = exercises.length > 0;

	return (
		<main className='bg-background text-foreground flex flex-1 flex-col overflow-hidden'>
			<div className='animate-in fade-in slide-in-from-bottom-4 mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16 duration-300'>
				<div className='flex items-center justify-between'>
					<div>
						<h1 className='text-foreground text-3xl font-bold'>Tense Trainer</h1>
						<p className='text-muted-foreground mt-2'>Выбери времена для тренировки</p>
					</div>
					{hasExercises && (
						<Button variant='ghost' size='sm' onClick={() => setStep('training')}>
							Продолжить
							<ArrowRightIcon />
						</Button>
					)}
				</div>

				<ModeSelector mode={mode} fixedLimit={fixedLimit} onUpdate={updateMode} />

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
						return (
							<TenseGroup
								key={group.label}
								group={group}
								selectedTenses={selectedTenses}
								onToggle={toggleTense}
								onToggleGroup={toggleGroup}
							/>
						);
					})}
				</div>

				<Button
					size='lg'
					onClick={startTraining}
					disabled={selectedTenses.length === 0 || isLoading}
				>
					{isLoading ? 'Загрузка...' : hasExercises ? 'Начать заново' : 'Начать'}
				</Button>
			</div>
		</main>
	);
};

export default SelectTrainingSection;
