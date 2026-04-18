'use client';

import { Badge } from '@/presentation/components/ui/badge';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { cn } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';

const NetworkBadge = () => {
	const t = useTranslations('network');
	const { status } = useNetworkStatus();

	if (status === 'online') return null;

	const label = t(status) || 'Unknown status';

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
