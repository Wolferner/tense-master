import { cn } from '@/shared/lib/utils';
import { routing } from '@/shared/i18n/config';
import { SerwistProvider } from '@/shared/pwa/serwist';
import { hasLocale } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
	metadataBase: new URL('https://tense-master.xyz'),
	title: 'Tense Master',
	description:
		'Практикуй английские времена — Present Simple, Past Perfect и другие — с упражнениями на перевод предложений',
	appleWebApp: { title: 'Tense Master', capable: true, statusBarStyle: 'default' },
	formatDetection: { telephone: false },
	openGraph: {
		title: 'Tense Master',
		type: 'website',
		siteName: 'Tense Master',
		description:
			'Практикуй английские времена — Present Simple, Past Perfect и другие — с упражнениями на перевод предложений',
		images: [{ url: '/og.png', width: 1200, height: 630 }],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Tense Master',
		description:
			'Практикуй английские времена — Present Simple, Past Perfect и другие — с упражнениями на перевод предложений',
		images: ['/og.png'],
	},
	icons: {
		icon: [
			{ url: '/favicon.ico' },
			{ url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
			{ url: '/favicon.svg', type: 'image/svg+xml' },
		],
		apple: '/apple-touch-icon.png',
	},
};

export function generateStaticParams() {
	return routing.locales.map(lang => ({ lang }));
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	if (!hasLocale(routing.locales, lang)) notFound();

	const messages = await getMessages();

	return (
		<html
			lang={lang}
			className={cn(
				'h-full',
				'antialiased',
				geistSans.variable,
				geistMono.variable,
				'font-sans',
				inter.variable,
			)}
		>
			<body className='flex min-h-full flex-col'>
				<NextIntlClientProvider messages={messages}>
					<SerwistProvider swUrl='/api/serwist/sw.js'>{children}</SerwistProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
