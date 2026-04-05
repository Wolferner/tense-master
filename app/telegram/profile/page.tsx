import type { Metadata } from 'next';

export const metadata: Metadata = {
	robots: { index: false, follow: false },
};

export default function TelegramProfilePage() {
	return (
		<main>
			<h1>Profile</h1>
		</main>
	);
}
