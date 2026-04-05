import ProfilePage from '@/presentation/web/pages/Profile/Profile';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Profile | Tense Master',
	description: 'Your progress and statistics',
	robots: { index: false, follow: false },
};

export default function Page() {
	return <ProfilePage />;
}
