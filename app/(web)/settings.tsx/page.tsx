import SettingsPage from '@/presentation/web/pages/Settings/Settings';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Настройки | Tense Master',
	description:
		'Настройки Tense Master. Здесь ты можешь настроить свои предпочтения, уведомления и другие параметры приложения.',
	robots: { index: false, follow: false },
};

export default function Page() {
	return <SettingsPage />;
}
