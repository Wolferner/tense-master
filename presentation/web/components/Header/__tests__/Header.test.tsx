import messages from '@/shared/i18n/messages/ru.json';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/i18n/navigation', async () => {
	const actual = await vi.importActual<typeof import('next/link')>('next/link');
	return {
		usePathname: vi.fn(),
		useRouter: vi.fn(() => ({ replace: vi.fn() })),
		Link: actual.default,
	};
});

vi.mock('../NetworkBadge/NetworkBadge', () => ({
	default: () => null,
}));

vi.mock('@/shared/hooks/useSwipeNavigation', () => ({
	useSwipeNavigation: vi.fn(),
}));

import { usePathname } from '@/shared/i18n/navigation';
import Header from '../Header';

describe('Header', () => {
	it('renders the logo', () => {
		vi.mocked(usePathname).mockReturnValue('/');
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<Header />
			</NextIntlClientProvider>,
		);
		expect(screen.getByRole('link', { name: 'Tense Master' })).toBeInTheDocument();
	});

	it('renders Home and Trainer nav links', () => {
		vi.mocked(usePathname).mockReturnValue('/');
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<Header />
			</NextIntlClientProvider>,
		);
		expect(screen.getByRole('link', { name: 'Главная' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Тренажер' })).toBeInTheDocument();
	});

	it('applies active styling to the link matching the current pathname', () => {
		vi.mocked(usePathname).mockReturnValue('/tense-trainer');
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<Header />
			</NextIntlClientProvider>,
		);
		expect(screen.getByRole('link', { name: 'Тренажер' })).toHaveClass('text-foreground');
	});

	it('applies inactive styling to links not matching the current pathname', () => {
		vi.mocked(usePathname).mockReturnValue('/tense-trainer');
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<Header />
			</NextIntlClientProvider>,
		);
		expect(screen.getByRole('link', { name: 'Главная' })).toHaveClass('text-muted-foreground');
	});

	it('profile button is enabled', () => {
		vi.mocked(usePathname).mockReturnValue('/');
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<Header />
			</NextIntlClientProvider>,
		);
		expect(
			screen.getByRole('link', {
				name: 'Профиль пользователя',
			}),
		).toBeEnabled();
	});
});
