export const Locale = {
	ru: 'ru',
	fr: 'fr',
	de: 'de',
	es: 'es',
} as const;

export type Locale = (typeof Locale)[keyof typeof Locale];
