import type { Metadata } from 'next';

export const metadata: Metadata = {
	robots: { index: false, follow: false },
};

export default function TelegramHomePage() {
	return (
		<main>
			<h1>Tense Master</h1>
		</main>
	);
}
