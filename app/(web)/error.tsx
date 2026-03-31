'use client';

import { Button } from '@/presentation/components/ui/button';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className='flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center'>
			<p className='text-muted-foreground text-sm'>{error.message || 'Something went wrong'}</p>
			<div className='flex gap-2'>
				<Button variant='outline' onClick={() => window.location.reload()}>
					Reload page
				</Button>
				<Button onClick={reset}>Try again</Button>
			</div>
		</div>
	);
}
