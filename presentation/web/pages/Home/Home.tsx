import Link from 'next/link';
import { Button } from '@/presentation/components/ui/button';

const REASONS = [
	{
		title: 'Контекст решает всё',
		description:
			'В английском одно и то же действие может передаваться разными временами в зависимости от смысла, который вы хотите выразить.',
	},
	{
		title: '12 времён — не миф',
		description:
			'Каждое время имеет свои маркеры и логику. Без практики они смешиваются и перестают ощущаться интуитивно.',
	},
	{
		title: 'Рабочих тренажёров нет',
		description:
			'Я не нашёл ни одного инструмента, который действительно тренирует выбор времени по контексту — поэтому создал его сам.',
	},
];

const HomePage = () => {
	return (
		<main className='flex flex-1 flex-col bg-background text-foreground'>
			<div className='mx-auto flex flex-1 max-w-3xl flex-col items-center justify-center gap-16 px-6 py-24'>
				<section className='flex flex-col items-center gap-6 text-center'>
					<span className='rounded-full border border-border bg-card px-4 py-1.5 text-sm text-primary'>
						English Tenses Trainer
					</span>
					<h1 className='text-5xl font-bold tracking-tight text-foreground'>Tense Master</h1>
					<p className='max-w-xl text-lg leading-relaxed text-muted-foreground'>
						Путаница с английскими временами — одна из самых частых проблем в изучении языка.
						Не потому что правила сложные, а потому что их нужно чувствовать в контексте.
						Этот тренажёр именно для этого.
					</p>
					<Button asChild size='lg' className='mt-2'>
						<Link href='/tense-trainer'>Начать тренировку</Link>
					</Button>
				</section>

				<section className='grid w-full gap-4 sm:grid-cols-3'>
					{REASONS.map(reason => (
						<div
							key={reason.title}
							className='rounded-xl border border-border bg-card p-6'
						>
							<h3 className='mb-2 font-semibold text-primary'>{reason.title}</h3>
							<p className='text-sm leading-relaxed text-muted-foreground'>{reason.description}</p>
						</div>
					))}
				</section>
			</div>
		</main>
	);
};

export default HomePage;
