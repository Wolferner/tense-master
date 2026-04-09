'use client';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from '@/presentation/components/ui/select';
import { Locale, routing } from '@/shared/i18n/config';
import { usePathname } from '@/shared/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';

const LOCALE_LABELS: Record<Locale, string> = {
	ru: 'RU',
	fr: 'FR',
	de: 'DE',
	es: 'ES',
};

const LOCALE_FULL_LABELS: Record<Locale, string> = {
	ru: 'Русский',
	fr: 'Français',
	de: 'Deutsch',
	es: 'Español',
};

const LocaleSelect = () => {
	const t = useTranslations('nav');
	const locale = useLocale() as Locale;
	const pathname = usePathname();

	const handleLocaleChange = (newLocale: string) => {
		window.location.href = `/${newLocale}${pathname === '/' ? '' : pathname}`;
	};

	return (
		<Select value={locale} onValueChange={handleLocaleChange}>
			<SelectTrigger
				aria-label={t('languageSelectorLabel')}
				className='h-7 w-auto gap-1 px-2 text-xs font-medium'
			>
				<span className='sm:hidden'>{LOCALE_LABELS[locale]}</span>
				<span className='hidden sm:inline'>{LOCALE_FULL_LABELS[locale]}</span>
			</SelectTrigger>
			<SelectContent position='popper' align='end'>
				{routing.locales.map(l => (
					<SelectItem key={l} value={l}>
						{LOCALE_FULL_LABELS[l]}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default LocaleSelect;
