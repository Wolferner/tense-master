'use client';

import { exerciseSyncService } from '@/client/infrastructure/dexie/container';
import { useEffect } from 'react';

export function SyncProvider() {
	useEffect(() => {
		void exerciseSyncService.sync();
	}, []);
	return null;
}
