'use client';

import type { ChartDataPoint } from '@/client/application/services/ProfileService';
import { TENSE_LABELS } from '@/presentation/web/pages/TenseTrainer/logic/tenseLabels';
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
	type TooltipContentProps,
} from 'recharts';

interface Props {
	data: ChartDataPoint[];
}

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

export function ProgressChart({ data }: Props) {
	if (data.length < 2 || data.every(p => p.cumulative === 0)) {
		return (
			<p className='text-muted-foreground text-sm'>
				Нужно минимум 2 сессии с правильными ответами чтобы показать прогресс
			</p>
		);
	}

	return (
		<ResponsiveContainer width='100%' height={220}>
			<AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
				<defs>
					<linearGradient id='correctGradient' x1='0' y1='0' x2='0' y2='1'>
						<stop offset='5%' stopColor='hsl(var(--primary))' stopOpacity={0.3} />
						<stop offset='95%' stopColor='hsl(var(--primary))' stopOpacity={0} />
					</linearGradient>
				</defs>
				<CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' />
				<XAxis
					dataKey='date'
					tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
					tickLine={false}
					axisLine={false}
					allowDecimals={false}
				/>
				<Tooltip content={ChartTooltip} />
				<Area
					type='monotone'
					dataKey='cumulative'
					stroke='hsl(var(--primary))'
					strokeWidth={2}
					fill='url(#correctGradient)'
					dot={{ r: 3, fill: 'hsl(var(--primary))', strokeWidth: 0 }}
					activeDot={{ r: 5, fill: 'hsl(var(--primary))', strokeWidth: 0 }}
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}
