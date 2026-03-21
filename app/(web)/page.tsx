import HomePage from '@/presentation/web/pages/Home/Home';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Tense Master',
	description: 'Practice English tenses with translation exercises',
};

export default function Page() {
	return <HomePage />;
}
