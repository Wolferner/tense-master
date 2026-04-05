import type { Metadata } from 'next';

export const metadata: Metadata = {
	robots: { index: false, follow: false },
};

export default function TelegramSettingsPage() {
	return (
		<main>
			<h1>Settings</h1>
		</main>
	);
}
