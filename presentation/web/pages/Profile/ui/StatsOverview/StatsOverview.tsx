import type { OverallStats } from '@/client/application/services/ProfileService';
import { useTranslations } from 'next-intl';

interface Props {
	stats: OverallStats;
}

export function StatsOverview({ stats }: Props) {
	const t = useTranslations('profile');

	return (
		<div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
			<StatCard label={t('total')} value={String(stats.total)} />
			<StatCard label={t('correct')} value={String(stats.correct)} sub={`${stats.accuracy}%`} />
			<StatCard label={t('skipped')} value={String(stats.skipped)} />
			<StatCard
				label={t('incorrect')}
				value={String(stats.total - stats.correct - stats.skipped)}
			/>
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
