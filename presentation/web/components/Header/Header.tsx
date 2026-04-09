'use client';

import { Button } from '@/presentation/components/ui/button';
import { NAV_ROUTES, ROUTES } from '@/shared/config/routes';
import { useSwipeNavigation } from '@/shared/hooks/useSwipeNavigation';
import { Locale, routing } from '@/shared/i18n/config';
import { Link, usePathname } from '@/shared/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import { User } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import NetworkBadge from '../NetworkBadge/NetworkBadge';

const LOCALE_LABELS: Record<Locale, string> = {
	ru: 'RU',
	fr: 'FR',
	de: 'DE',
	es: 'ES',
};

const Header = () => {
	const t = useTranslations('nav');
	const locale = useLocale() as Locale;

	const pathname = usePathname();

	const NAV_LINKS = [
		{ href: ROUTES.home, label: t('home') },
		{ href: ROUTES.trainer, label: t('trainer') },
	];
	useSwipeNavigation([...NAV_ROUTES]);

	const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newLocale = e.target.value as Locale;
		window.location.href = `/${newLocale}${pathname === '/' ? '' : pathname}`;
	};

	return (
		<header className='border-border bg-background/90 sticky top-0 z-50 border-b backdrop-blur-md'>
			<div className='mx-auto flex h-16 max-w-5xl items-center justify-between px-6'>
				<div className='flex items-center gap-10'>
					<Link href={ROUTES.home} aria-label='Tense Master' className='flex items-center gap-2'>
						<span
							aria-hidden='true'
							className='bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md text-xs font-bold'
						>
							T
						</span>
						<span
							aria-hidden='true'
							className='text-foreground hidden text-sm font-semibold tracking-tight md:block'
						>
							Tense<span className='text-primary'>Master</span>
						</span>
					</Link>

					<nav aria-label={t('mainNavLabel')} className='flex items-center gap-0.5'>
						{NAV_LINKS.map(link => (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									'relative px-4 py-1.5 text-sm font-medium transition-colors',
									pathname === link.href
										? 'text-foreground'
										: 'text-muted-foreground hover:text-foreground',
								)}
							>
								{link.label}
								{pathname === link.href && (
									<span className='bg-primary absolute inset-x-2 -bottom-[17px] h-0.5 rounded-full' />
								)}
							</Link>
						))}
					</nav>
				</div>

				<div className='flex items-center gap-2'>
					<NetworkBadge />

					<select
						defaultValue={locale}
						onChange={handleLocaleChange}
						aria-label={t('languageSelectorLabel')}
						className='text-foreground bg-background border-border rounded-md border px-2 py-1 text-xs font-medium'
					>
						{routing.locales.map(l => (
							<option key={l} value={l}>
								{LOCALE_LABELS[l]}
							</option>
						))}
					</select>

					<Button
						variant='ghost'
						size='icon-sm'
						className={cn(
							pathname === ROUTES.profile && 'border-border bg-card text-card-foreground border',
						)}
						asChild
					>
						<Link href={ROUTES.profile} aria-label={t('profileAriaLabel')}>
							<User />
						</Link>
					</Button>
				</div>
			</div>
		</header>
	);
};

export default Header;
