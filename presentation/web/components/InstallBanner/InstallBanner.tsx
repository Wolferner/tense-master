'use client';

import { Button } from '@/presentation/components/ui/button';
import { useInstallPrompt } from '@/shared/hooks/useInstallPrompt';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

const InstallBanner = () => {
	const t = useTranslations('install');

	const { canInstall, install, dismiss } = useInstallPrompt();

	if (!canInstall) return null;

	return (
		<div className='bg-background border-border fixed right-4 bottom-4 left-4 z-50 flex items-center justify-between gap-4 rounded-xl border p-4 shadow-lg md:right-6 md:left-auto md:w-80'>
			<p className='text-sm'>
				<span className='text-foreground font-medium'>{t('title')}</span>
				<br />
				<span className='text-muted-foreground'>{t('description')}</span>
			</p>
			<div className='flex shrink-0 items-center gap-2'>
				<Button size='sm' onClick={install}>
					{t('installButton')}
				</Button>
				<Button variant='ghost' size='icon-sm' onClick={dismiss}>
					<X />
				</Button>
			</div>
		</div>
	);
};

export default InstallBanner;
