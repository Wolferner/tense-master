'use client';

import { Button } from '@/presentation/components/ui/button';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { TenseType } from '@/server/domain/value-objects';
import { TENSE_GROUPS, TENSE_LABELS } from '@/shared/config/tenseLabels';
import { ArrowRight } from 'lucide-react';
import { FixedLimit, SessionMode } from '../logic/types';
import ModeSelector from './ModeSelector';

type Props = {
	selectedTenses: TenseType[];
	toggleTense: (tense: TenseType) => void;
	selectAll: () => void;
	clearAll: () => void;
	setTenses: (tenses: TenseType[]) => void;
	mode: SessionMode;
	fixedLimit: FixedLimit;
	setMode: (mode: SessionMode) => void;
	setFixedLimit: (limit: FixedLimit) => void;
	hasExercises: boolean;
	isLoading: boolean;
	onContinue: () => void;
	onStart: () => void;
};

const SelectStep = ({
	selectedTenses,
	toggleTense,
	selectAll,
	clearAll,
	setTenses,
	mode,
	fixedLimit,
	setMode,
	setFixedLimit,
	hasExercises,
	isLoading,
	onContinue,
	onStart,
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

			<ModeSelector
				mode={mode}
				fixedLimit={fixedLimit}
				onModeChange={setMode}
				onLimitChange={setFixedLimit}
			/>

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
									{allSelected ? 'Снять' : 'Выбрать все'}
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

			<Button size='lg' onClick={onStart} disabled={selectedTenses.length === 0 || isLoading}>
				{isLoading ? 'Загрузка...' : hasExercises ? 'Начать заново' : 'Начать'}
			</Button>
		</div>
	</main>
);

export default SelectStep;
