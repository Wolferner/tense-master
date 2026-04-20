'use client';

import { useSessionStore } from '@/client/stores/sessionStore';
import { LocaleType } from '@/domain/value-objects';
import { useLocale } from 'next-intl';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

export function SyncProvider() {
	const locale = useLocale() as LocaleType;
	const { syncExercises, finishSession, sessionId, sessionLocale } = useSessionStore(
		useShallow(s => ({
			syncExercises: s.syncExercises,
			finishSession: s.finishSession,
			sessionId: s.sessionId,
			sessionLocale: s.sessionLocale,
		})),
	);

	useEffect(() => {
		if (sessionId && sessionLocale && sessionLocale !== locale) {
			void finishSession();
		}
		void syncExercises(locale);
	}, [locale, syncExercises, finishSession, sessionId, sessionLocale]);

	return null;
}
