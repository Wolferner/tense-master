'use client';

import { Badge } from '@/presentation/components/ui/badge';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';

const NetworkBadge = () => {
	const { status } = useNetworkStatus();

	if (status === 'online') return null;

	const label = BADGE_LABELS[status] || 'Unknown status';

	return <Badge variant={status === 'offline' ? 'destructive' : 'outline'}>{label}</Badge>;
};

export default NetworkBadge;

const BADGE_LABELS: Record<string, string> = {
	online: 'Online',
	offline: 'Offline',
	slow: 'Slow connection',
};
