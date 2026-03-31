'use client';

import { Button } from '@/presentation/components/ui/button';

export default function GlobalError({ reset }: { reset: () => void }) {
	return (
		<html>
			<body className='flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center'>
				<p className='text-sm'>Something went wrong</p>
				<div className='flex gap-2'>
					<Button variant='outline' onClick={() => window.location.reload()}>
						Reload page
					</Button>
					<Button onClick={reset}>Try again</Button>
				</div>
			</body>
		</html>
	);
}
