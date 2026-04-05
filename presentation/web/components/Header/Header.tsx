'use client';

import { Button } from '@/presentation/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NetworkBadge from '../NetworkBadge/NetworkBadge';

const NAV_LINKS = [
	{ href: '/', label: 'Главная' },
	{ href: '/tense-trainer', label: 'Тренажер' },
];

const Header = () => {
	const pathname = usePathname();

	return (
		<header className='border-border bg-background/90 sticky top-0 z-50 border-b backdrop-blur-md'>
			<div className='mx-auto flex h-16 max-w-5xl items-center justify-between px-6'>
				<div className='flex items-center gap-10'>
					<Link href='/' aria-label='Tense Master' className='flex items-center gap-2'>
						<span
							aria-hidden='true'
							className='bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md text-xs font-bold'
						>
							T
						</span>
						<span
							aria-hidden='true'
							className='text-foreground hidden text-sm font-semibold tracking-tight md:block'
						>
							Tense<span className='text-primary'>Master</span>
						</span>
					</Link>

					<nav aria-label='Основная навигация' className='flex items-center gap-0.5'>
						{NAV_LINKS.map(link => (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									'relative px-4 py-1.5 text-sm font-medium transition-colors',
									pathname === link.href
										? 'text-foreground'
										: 'text-muted-foreground hover:text-foreground',
								)}
							>
								{link.label}
								{pathname === link.href && (
									<span className='bg-primary absolute inset-x-2 -bottom-[17px] h-0.5 rounded-full' />
								)}
							</Link>
						))}
					</nav>
				</div>

				<div className='flex items-center gap-2'>
					<NetworkBadge />
					<Button variant='ghost' size='icon-sm' asChild>
						<Link href='/profile' aria-label='Профиль пользователя'>
							<User />
						</Link>
					</Button>
				</div>
			</div>
		</header>
	);
};

export default Header;
