import { Locale } from '@/domain/value-objects/Locale';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
	locales: [Locale.ru, Locale.de, Locale.fr, Locale.es],
	defaultLocale: Locale.ru,
	// localeDetection: false,
});

export type { Locale };
