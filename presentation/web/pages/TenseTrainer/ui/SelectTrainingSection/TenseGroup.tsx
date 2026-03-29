import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Tense } from '@/server/domain/value-objects';
import { ITenseGroup, TENSE_LABELS } from '@/shared/config/tenseLabels';

interface TenseGroupProps {
	group: ITenseGroup;
	selectedTenses: Tense[];
	onToggle: (tense: Tense) => void;
	onToggleGroup: (group: ITenseGroup) => void;
}

const TenseGroup = ({ onToggle, onToggleGroup, group, selectedTenses }: TenseGroupProps) => {
	const allSelected = group.tenses.every(tense => selectedTenses.includes(tense));

	const toggleGroupHandler = () => {
		onToggleGroup(group);
	};

	return (
		<div key={group.label} className='flex flex-col gap-2'>
			<div className='flex items-center justify-between'>
				<span className='text-foreground text-sm font-semibold'>{group.label}</span>
				<button onClick={toggleGroupHandler} className='text-primary text-xs hover:underline'>
					{allSelected ? 'Снять' : 'Выбрать все'}
				</button>
			</div>
			<div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
				{group.tenses.map(tense => (
					<TenseItem
						key={tense}
						tense={tense}
						isSelected={selectedTenses.includes(tense)}
						onToggle={onToggle}
					/>
				))}
			</div>
		</div>
	);
};

export default TenseGroup;

interface TenseItemProps {
	tense: Tense;
	isSelected: boolean;
	onToggle: (tense: Tense) => void;
}

const TenseItem = ({ tense, isSelected, onToggle }: TenseItemProps) => {
	return (
		<label
			key={tense}
			className='border-border bg-card hover:bg-muted flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors'
		>
			<Checkbox checked={isSelected} onCheckedChange={() => onToggle(tense)} />
			<span className='text-foreground text-sm font-medium'>{TENSE_LABELS[tense]}</span>
		</label>
	);
};
