import TenseTrainer from '@/presentation/web/pages/TenseTrainer/TenseTrainer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Tense Trainer | Tense Master',
	description: 'Translate sentences and practice English tenses',
	robots: { index: false, follow: false },
};

export default function TenseTrainerPage() {
	return <TenseTrainer />;
}
