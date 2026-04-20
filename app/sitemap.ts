import { routing } from '@/shared/i18n/config';
import { MetadataRoute } from 'next';

const BASE_URL = 'https://tense-master.xyz';

export default function sitemap(): MetadataRoute.Sitemap {
	return routing.locales.map(locale => ({
		url: `${BASE_URL}/${locale}`,
		lastModified: new Date(),
		changeFrequency: 'monthly' as const,
		priority: locale === routing.defaultLocale ? 1 : 0.8,
		alternates: {
			languages: Object.fromEntries(routing.locales.map(l => [l, `${BASE_URL}/${l}`])),
		},
	}));
}
