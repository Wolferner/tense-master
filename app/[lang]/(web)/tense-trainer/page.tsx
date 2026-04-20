import TenseTrainer from '@/presentation/web/pages/TenseTrainer/TenseTrainer';
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
		title: t('trainer.title'),
		description: t('trainer.description'),
		robots: { index: false, follow: false },
	};
}

export default function TenseTrainerPage() {
	return <TenseTrainer />;
}
