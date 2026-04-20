import { Button } from '@/presentation/components/ui/button';
import { ROUTES } from '@/shared/config/routes';
import { Link } from '@/shared/i18n/navigation';
import { HardDriveIcon, ShieldOffIcon, WifiOffIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Reason from './ui/Reason';

const HomePage = async () => {
	const t = await getTranslations('home');

	const reasons = [
		{
			key: 'context',
			title: t('reasons.context.title'),
			description: t.rich('reasons.context.description', { bold: chunks => <b>{chunks}</b> }),
		},
		{
			key: 'forms',
			title: t('reasons.forms.title'),
			description: t.rich('reasons.forms.description', { bold: chunks => <b>{chunks}</b> }),
		},
		{
			key: 'noTools',
			title: t('reasons.noTools.title'),
			description: t.rich('reasons.noTools.description', { bold: chunks => <b>{chunks}</b> }),
		},
	];
	return (
		<main className='bg-background text-foreground flex flex-1 flex-col'>
			<div className='mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center gap-16 px-6 py-24'>
				<section
					aria-labelledby='home-heading'
					className='flex flex-col items-center gap-6 text-center'
				>
					<h1
						id='home-heading'
						className='border-border bg-card text-primary rounded-full border px-4 py-1.5 text-sm'
					>
						{t('tagline')}
					</h1>
					<span aria-hidden='true' className='text-foreground text-5xl font-bold tracking-tight'>
						Tense Master
					</span>
					<p className='text-muted-foreground max-w-xl text-lg leading-relaxed'>
						{t.rich('heroDescription', { bold: chunks => <b>{chunks}</b> })}
					</p>
					<Button asChild size='lg' className='mt-2'>
						<Link href={ROUTES.trainer} aria-label={t('startTrainingAriaLabel')}>
							{t('startTraining')}
						</Link>
					</Button>
				</section>

				<section aria-labelledby='reasons-heading' className='grid w-full gap-4 sm:grid-cols-3'>
					<h2 id='reasons-heading' className='sr-only'>
						{t('whyHeading')}
					</h2>
					{reasons.map(reason => (
						<Reason key={reason.key} title={reason.title} description={reason.description} />
					))}
				</section>

				<section
					aria-labelledby='privacy-heading'
					className='border-border bg-card w-full rounded-2xl border p-8'
				>
					<h2
						id='privacy-heading'
						className='text-foreground mb-6 text-center text-lg font-semibold'
					>
						{t('privacy.title')}
					</h2>
					<ul className='grid gap-4 sm:grid-cols-3'>
						<li className='flex items-start gap-3'>
							<HardDriveIcon className='text-primary mt-0.5 size-5 shrink-0' />
							<div>
								<p className='text-foreground text-sm font-medium'>
									{t('privacy.localStorage.title')}
								</p>
								<p className='text-muted-foreground text-sm'>
									{t('privacy.localStorage.description')}
								</p>
							</div>
						</li>
						<li className='flex items-start gap-3'>
							<ShieldOffIcon className='text-primary mt-0.5 size-5 shrink-0' />
							<div>
								<p className='text-foreground text-sm font-medium'>
									{t('privacy.noTracking.title')}
								</p>
								<p className='text-muted-foreground text-sm'>
									{t('privacy.noTracking.description')}
								</p>
							</div>
						</li>
						<li className='flex items-start gap-3'>
							<WifiOffIcon className='text-primary mt-0.5 size-5 shrink-0' />
							<div>
								<p className='text-foreground text-sm font-medium'>{t('privacy.offline.title')}</p>
								<p className='text-muted-foreground text-sm'>{t('privacy.offline.description')}</p>
							</div>
						</li>
					</ul>
				</section>
			</div>
		</main>
	);
};

export default HomePage;
