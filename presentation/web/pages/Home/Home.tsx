import { Button } from '@/presentation/components/ui/button';
import { ROUTES } from '@/shared/config/routes';
import { Link } from '@/shared/i18n/navigation';
import { HardDriveIcon, ShieldOffIcon, WifiOffIcon } from 'lucide-react';
import { REASONS } from './logic/reasons';
import Reason from './ui/Reason';

const HomePage = () => {
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
						Практикуй английские времена офлайн
					</h1>
					<span aria-hidden='true' className='text-foreground text-5xl font-bold tracking-tight'>
						Tense Master
					</span>
					<p className='text-muted-foreground max-w-xl text-lg leading-relaxed'>
						Путаница с <b>английскими временами</b> — одна из самых частых проблем в изучении
						<b>языка</b>. Не потому что правила сложные, а потому что их нужно чувствовать в
						контексте. Этот <b>тренажёр</b> именно для этого.
					</p>
					<Button asChild size='lg' className='mt-2'>
						<Link href={ROUTES.trainer} aria-label='Начать тренировку по английским временам'>
							Начать тренировку
						</Link>
					</Button>
				</section>

				<section aria-labelledby='reasons-heading' className='grid w-full gap-4 sm:grid-cols-3'>
					<h2 id='reasons-heading' className='sr-only'>
						Почему этот тренажёр
					</h2>
					{REASONS.map(reason => (
						<Reason key={reason.title} reason={reason} />
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
						Ваши данные остаются у вас
					</h2>
					<ul className='grid gap-4 sm:grid-cols-3'>
						<li className='flex items-start gap-3'>
							<HardDriveIcon className='text-primary mt-0.5 size-5 shrink-0' />
							<div>
								<p className='text-foreground text-sm font-medium'>Локальное хранилище</p>
								<p className='text-muted-foreground text-sm'>
									Весь прогресс хранится в вашем браузере — никуда не уходит.
								</p>
							</div>
						</li>
						<li className='flex items-start gap-3'>
							<ShieldOffIcon className='text-primary mt-0.5 size-5 shrink-0' />
							<div>
								<p className='text-foreground text-sm font-medium'>Без слежки</p>
								<p className='text-muted-foreground text-sm'>
									Мы не собираем, не храним и не передаём никакие данные о вас.
								</p>
							</div>
						</li>
						<li className='flex items-start gap-3'>
							<WifiOffIcon className='text-primary mt-0.5 size-5 shrink-0' />
							<div>
								<p className='text-foreground text-sm font-medium'>Работает офлайн</p>
								<p className='text-muted-foreground text-sm'>
									После первой загрузки приложение работает без интернета.
								</p>
							</div>
						</li>
					</ul>
				</section>
			</div>
		</main>
	);
};

export default HomePage;
