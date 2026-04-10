'use client';

import { exerciseSyncService } from '@/client/infrastructure/container';
import { useLocale } from 'next-intl';
import { useEffect } from 'react';

export function SyncProvider() {
	const locale = useLocale();

	useEffect(() => {
		void exerciseSyncService.sync(locale);
	}, [locale]);

	return null;
}
