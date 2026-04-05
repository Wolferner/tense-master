import type { TenseStat } from '@/client/application/services/ProfileService';
import { TENSE_LABELS } from '@/presentation/web/pages/TenseTrainer/logic/tenseLabels';

interface Props {
	stats: TenseStat[];
}

export function TenseBreakdown({ stats }: Props) {
	if (stats.length === 0) {
		return <p className='text-muted-foreground text-sm'>Нет данных</p>;
	}

	return (
		<div className='flex flex-col gap-3'>
			{stats.map(s => (
				<div key={s.tense} className='flex items-center gap-4'>
					<span className='text-foreground w-48 shrink-0 text-sm'>{TENSE_LABELS[s.tense]}</span>
					<div className='bg-muted relative h-2 flex-1 overflow-hidden rounded-full'>
						<div
							className='bg-primary absolute inset-y-0 left-0 rounded-full'
							style={{ width: `${s.accuracy}%` }}
						/>
					</div>
					<span className='text-muted-foreground w-10 text-right text-sm'>{s.accuracy}%</span>
					<span className='text-muted-foreground text-sm'>({s.total})</span>
				</div>
			))}
		</div>
	);
}
