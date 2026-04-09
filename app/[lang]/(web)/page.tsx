import HomePage from '@/presentation/web/pages/Home/Home';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Tense Master',
	description:
		'Практикуй английские времена — Present Simple, Past Perfect и другие — с упражнениями на перевод предложений',
};

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ locale: string }>;
// }): Promise<Metadata> {
//   const { locale } = await params;
//   const t = await getTranslations({ locale, namespace: 'meta' });

//   return {
//     title: t('title'),
//     description: t('description'),
//   };
// }

const jsonLd = {
	'@context': 'https://schema.org',
	'@type': 'WebApplication',
	name: 'Tense Master',
	url: 'https://tense-master.xyz',
	description: 'Практикуй английские времена с переводом предложений',
	applicationCategory: 'EducationalApplication',
	inLanguage: 'ru',
	offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
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
