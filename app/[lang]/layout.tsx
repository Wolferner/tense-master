import '@/app/globals.css';
import { routing } from '@/shared/i18n/config';
import { cn } from '@/shared/lib/utils';
import { SerwistProvider } from '@/shared/pwa/serwist';
import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import { notFound } from 'next/navigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> {
	const { lang } = await params;
	const t = await getTranslations({ locale: lang, namespace: 'metadata' });
	const title = t('title');
	const description = t('description');

	return {
		metadataBase: new URL('https://tense-master.xyz'),
		title,
		description,
		appleWebApp: { title, capable: true, statusBarStyle: 'default' },
		formatDetection: { telephone: false },
		openGraph: {
			title,
			type: 'website',
			siteName: 'Tense Master',
			description,
			images: [{ url: '/og.png', width: 1200, height: 630 }],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
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
}

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
	setRequestLocale(lang);

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
				<NextIntlClientProvider>
					<SerwistProvider swUrl='/api/serwist/sw.js'>{children}</SerwistProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
