import HomePage from '@/presentation/web/pages/Home/Home';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> {
	const { lang } = await params;
	const t = await getTranslations({ locale: lang, namespace: 'metadata' });

	return {
		title: t('title'),
		description: t('description'),
	};
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
	const { lang } = await params;
	const t = await getTranslations({ locale: lang, namespace: 'metadata' });

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: 'Tense Master',
		url: 'https://tense-master.xyz',
		description: t('home.jsonLdDescription'),
		applicationCategory: 'EducationalApplication',
		inLanguage: lang,
		offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
	};

	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<HomePage />
		</>
	);
}
