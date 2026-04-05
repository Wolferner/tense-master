import { ChartDataPoint } from '@/client/application/services/ProfileService';
import { TooltipContentProps } from 'recharts';
import { TENSE_LABELS } from '../../../TenseTrainer/logic/tenseLabels';

function ChartTooltip({ active, payload }: TooltipContentProps) {
	if (!active || !payload?.length) return null;
	const point = payload[0].payload as ChartDataPoint;
	return (
		<div className='border-border bg-card rounded-xl border p-3 shadow-md'>
			<p className='text-foreground text-sm font-medium'>{point.date}</p>
			<p className='text-muted-foreground text-xs'>
				За сессию: <span className='text-foreground font-medium'>{point.sessionCorrect}</span>
			</p>
			<p className='text-muted-foreground text-xs'>
				Всего: <span className='text-foreground font-medium'>{point.cumulative}</span>
			</p>
			<div className='mt-2 flex flex-wrap gap-1'>
				{point.tenses.map(t => (
					<span key={t} className='bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs'>
						{TENSE_LABELS[t]}
					</span>
				))}
			</div>
		</div>
	);
}

export default ChartTooltip;
