import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
	locales: ['ru', 'fr', 'de', 'es'],
	defaultLocale: 'ru',
});

export type Locale = (typeof routing.locales)[number];
