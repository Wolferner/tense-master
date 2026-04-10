import { Locale } from '@/domain/value-objects/Locale';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
	locales: Object.values(Locale) as [Locale, ...Locale[]],
	defaultLocale: Locale.ru,
	// localeDetection: false,
});

export type { Locale };
