'use client';

import { useSessionStore } from '@/client/stores/sessionStore';
import { LocaleType } from '@/domain/value-objects';
import { useLocale } from 'next-intl';
import { useEffect } from 'react';

export function SyncProvider() {
	const locale = useLocale() as LocaleType;
	const syncExercises = useSessionStore(s => s.syncExercises);

	useEffect(() => {
		void syncExercises(locale);
	}, [locale, syncExercises]);

	return null;
}
