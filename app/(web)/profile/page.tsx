import ProfilePage from '@/presentation/web/pages/Profile/Profile';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Профиль | Tense Master',
	description:
		'Твой профиль в Tense Master. Здесь ты можешь увидеть свою статистику, достижения и настройки.',
	robots: { index: false, follow: false },
};

export default function Page() {
	return <ProfilePage />;
}
