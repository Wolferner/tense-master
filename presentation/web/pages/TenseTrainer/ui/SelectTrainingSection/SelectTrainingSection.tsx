'use client';

import { Button } from '@/presentation/components/ui/button';
import { TenseType } from '@/server/domain/value-objects';
import { ITenseGroup, TENSE_GROUPS } from '@/shared/config/tenseLabels';
import { ArrowRight } from 'lucide-react';
import { FixedLimit, TrainingMode } from '../../logic/types';
import ModeSelector from './ModeSelector';
import TenseGroup from './TenseGroup';

type Props = {
	selectedTenses: TenseType[];
	hasExercises: boolean;
	isLoading: boolean;
	mode: TrainingMode;
	fixedLimit: FixedLimit;

	toggleTense: (tense: TenseType) => void;
	selectAll: () => void;
	clearAll: () => void;
	onUpdateMode: (patch: { mode?: TrainingMode; limit?: FixedLimit }) => void;
	onToggleGroup: (group: ITenseGroup) => void;
	onContinue: () => void;
	onStart: () => void;
};

const SelectTrainingSection = ({
	selectedTenses,
	toggleTense,
	selectAll,
	clearAll,
	mode,
	fixedLimit,
	onUpdateMode,
	hasExercises,
	isLoading,
	onContinue,
	onStart,
	onToggleGroup,
}: Props) => (
	<main className='bg-background text-foreground flex flex-1 flex-col overflow-hidden'>
		<div className='animate-in fade-in slide-in-from-bottom-4 mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16 duration-300'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-foreground text-3xl font-bold'>Tense Trainer</h1>
					<p className='text-muted-foreground mt-2'>Выбери времена для тренировки</p>
				</div>
				{hasExercises && (
					<Button variant='ghost' size='sm' onClick={onContinue}>
						Продолжить
						<ArrowRight />
					</Button>
				)}
			</div>

			<ModeSelector mode={mode} fixedLimit={fixedLimit} onUpdate={onUpdateMode} />

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
							onToggleGroup={onToggleGroup}
						/>
					);
				})}
			</div>

			<Button size='lg' onClick={onStart} disabled={selectedTenses.length === 0 || isLoading}>
				{isLoading ? 'Загрузка...' : hasExercises ? 'Начать заново' : 'Начать'}
			</Button>
		</div>
	</main>
);

export default SelectTrainingSection;
