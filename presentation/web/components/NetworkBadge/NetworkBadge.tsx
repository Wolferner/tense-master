'use client';

import { Badge } from '@/presentation/components/ui/badge';
import { cn } from '@/shared/lib/utils';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';

const NetworkBadge = () => {
	const { status } = useNetworkStatus();

	if (status === 'online') return null;

	const label = BADGE_LABELS[status] || 'Unknown status';

	const isOffline = status === 'offline';

	return (
		<>
			<span
				className={cn(
					'size-2 rounded-full md:hidden',
					isOffline ? 'bg-destructive' : 'bg-yellow-500',
				)}
			/>
			<Badge className='hidden md:inline-flex' variant={isOffline ? 'destructive' : 'outline'}>
				{label}
			</Badge>
		</>
	);
};

export default NetworkBadge;

const BADGE_LABELS: Record<string, string> = {
	online: 'Online',
	offline: 'Offline',
	slow: 'Slow connection',
};
