import ProfilePage from '@/presentation/web/pages/Profile/Profile';
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
		title: t('profile.title'),
		description: t('profile.description'),
		robots: { index: false, follow: false },
	};
}

export default function Page() {
	return <ProfilePage />;
}
