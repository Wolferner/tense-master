import TenseTrainer from '@/presentation/web/pages/TenseTrainer/TenseTrainer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Тренажер времен | Tense Master',
	description:
		'Тренажер английских времен Tense Master. Практикуйся в использовании всех 16 времен английского языка с помощью интерактивных упражнений и мгновенной обратной связи.',
	robots: { index: false, follow: false },
};

export default function TenseTrainerPage() {
	return <TenseTrainer />;
}
