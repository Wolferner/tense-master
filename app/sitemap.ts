import { routing } from '@/shared/i18n/config';
import { MetadataRoute } from 'next';

const BASE_URL = 'https://tense-master.xyz';

export default function sitemap(): MetadataRoute.Sitemap {
	const otherLocales = routing.locales.filter(l => l !== routing.defaultLocale);

	return [
		{
			url: `${BASE_URL}/${routing.defaultLocale}`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 1,
			alternates: {
				languages: Object.fromEntries(
					otherLocales.map(locale => [locale, `${BASE_URL}/${locale}`]),
				),
			},
		},
	];
}
