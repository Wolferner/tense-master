import { Button } from '@/presentation/components/ui/button';
import Link from 'next/link';
import { REASONS } from './logic/reason';
import Reason from './ui/Reason';

const HomePage = () => {
	return (
		<main className='bg-background text-foreground flex flex-1 flex-col'>
			<div className='mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center gap-16 px-6 py-24'>
				<section
					aria-labelledby='home-heading'
					className='flex flex-col items-center gap-6 text-center'
				>
					<span
						aria-hidden='true'
						className='border-border bg-card text-primary rounded-full border px-4 py-1.5 text-sm'
					>
						English Tenses Trainer
					</span>
					<h1 id='home-heading' className='text-foreground text-5xl font-bold tracking-tight'>
						Tense Master
					</h1>
					<p className='text-muted-foreground max-w-xl text-lg leading-relaxed'>
						Путаница с английскими временами — одна из самых частых проблем в изучении языка. Не
						потому что правила сложные, а потому что их нужно чувствовать в контексте. Этот тренажёр
						именно для этого.
					</p>
					<Button asChild size='lg' className='mt-2'>
						<Link href='/tense-trainer' aria-label='Начать тренировку по английским временам'>
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
			</div>
		</main>
	);
};

export default HomePage;
