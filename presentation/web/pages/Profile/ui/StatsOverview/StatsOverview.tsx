import type { OverallStats } from '@/client/application/services/ProfileService';

interface Props {
	stats: OverallStats;
}

export function StatsOverview({ stats }: Props) {
	return (
		<div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
			<StatCard label='Всего' value={String(stats.total)} />
			<StatCard label='Правильно' value={String(stats.correct)} sub={`${stats.accuracy}%`} />
			<StatCard label='Пропущено' value={String(stats.skipped)} />
			<StatCard label='Неверно' value={String(stats.total - stats.correct - stats.skipped)} />
		</div>
	);
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
	return (
		<div className='border-border bg-card rounded-xl border p-4'>
			<p className='text-muted-foreground text-xs font-semibold tracking-wide uppercase'>{label}</p>
			<p className='text-foreground text-2xl font-bold'>{value}</p>
			{sub && <p className='text-muted-foreground text-sm'>{sub}</p>}
		</div>
	);
}
