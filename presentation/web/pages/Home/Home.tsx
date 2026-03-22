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
		<main className='bg-background text-foreground flex flex-1 flex-col'>
			<div className='mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center gap-16 px-6 py-24'>
				<section className='flex flex-col items-center gap-6 text-center'>
					<span className='border-border bg-card text-primary rounded-full border px-4 py-1.5 text-sm'>
						English Tenses Trainer
					</span>
					<h1 className='text-foreground text-5xl font-bold tracking-tight'>Tense Master</h1>
					<p className='text-muted-foreground max-w-xl text-lg leading-relaxed'>
						Путаница с английскими временами — одна из самых частых проблем в изучении языка. Не
						потому что правила сложные, а потому что их нужно чувствовать в контексте. Этот тренажёр
						именно для этого.
					</p>
					<Button asChild size='lg' className='mt-2'>
						<Link href='/tense-trainer'>Начать тренировку</Link>
					</Button>
				</section>

				<section className='grid w-full gap-4 sm:grid-cols-3'>
					{REASONS.map(reason => (
						<div key={reason.title} className='border-border bg-card rounded-xl border p-6'>
							<h3 className='text-primary mb-2 font-semibold'>{reason.title}</h3>
							<p className='text-muted-foreground text-sm leading-relaxed'>{reason.description}</p>
						</div>
					))}
				</section>
			</div>
		</main>
	);
};

export default HomePage;
