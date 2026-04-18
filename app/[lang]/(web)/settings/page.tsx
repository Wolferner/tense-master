import SettingsPage from '@/presentation/web/pages/Settings/Settings';
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
		title: t('settings.title'),
		description: t('settings.description'),
		robots: { index: false, follow: false },
	};
}

export default function Page() {
	return <SettingsPage />;
}
