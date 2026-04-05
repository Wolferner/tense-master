import type { Metadata } from 'next';

export const metadata: Metadata = {
	robots: { index: false, follow: false },
};

export default function TelegramTenseTrainerPage() {
	return (
		<main>
			<h1>Tense Trainer</h1>
		</main>
	);
}
