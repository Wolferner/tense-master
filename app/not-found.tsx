import { Button } from '@/presentation/components/ui/button';
import { Link } from '@/shared/i18n/navigation';

export default function NotFound() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center'>
			<h1 className='text-foreground text-2xl font-semibold'>404</h1>
			<p className='text-muted-foreground text-sm'>Page not found</p>
			<Button asChild variant='outline'>
				<Link href='/'>Go home</Link>
			</Button>
		</div>
	);
}
