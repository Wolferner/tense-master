'use client';

import type { ChartDataPoint } from '@/client/application/services/ProfileService';
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import ChartTooltip from './ChartTooltip';

interface Props {
	data: ChartDataPoint[];
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
						<stop offset='5%' stopColor='var(--primary)' stopOpacity={0.3} />
						<stop offset='95%' stopColor='var(--primary)' stopOpacity={0} />
					</linearGradient>
				</defs>
				<CartesianGrid strokeDasharray='3 3' stroke='var(--border)' />
				<XAxis
					dataKey='date'
					tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
					tickLine={false}
					axisLine={false}
					allowDecimals={false}
				/>
				<Tooltip content={ChartTooltip} />
				<Area
					type='monotone'
					dataKey='cumulative'
					stroke='var(--primary)'
					strokeWidth={2}
					fill='url(#correctGradient)'
					dot={{ r: 3, fill: 'var(--primary)', strokeWidth: 0 }}
					activeDot={{ r: 5, fill: 'var(--primary)', strokeWidth: 0 }}
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}
