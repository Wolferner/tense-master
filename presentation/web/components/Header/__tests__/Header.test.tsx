import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
	usePathname: vi.fn(),
}));

import { usePathname } from 'next/navigation';
import Header from '../Header';

describe('Header', () => {
	it('renders the logo', () => {
		vi.mocked(usePathname).mockReturnValue('/');
		render(<Header />);
		expect(screen.getByRole('link', { name: 'Tense Master' })).toBeInTheDocument();
	});

	it('renders Home and Trainer nav links', () => {
		vi.mocked(usePathname).mockReturnValue('/');
		render(<Header />);
		expect(screen.getByRole('link', { name: 'Главная' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Тренажер' })).toBeInTheDocument();
	});

	it('applies active styling to the link matching the current pathname', () => {
		vi.mocked(usePathname).mockReturnValue('/tense-trainer');
		render(<Header />);
		expect(screen.getByRole('link', { name: 'Тренажер' })).toHaveClass('text-foreground');
	});

	it('applies inactive styling to links not matching the current pathname', () => {
		vi.mocked(usePathname).mockReturnValue('/tense-trainer');
		render(<Header />);
		expect(screen.getByRole('link', { name: 'Главная' })).toHaveClass('text-muted-foreground');
	});

	it('profile button is enabled', () => {
		vi.mocked(usePathname).mockReturnValue('/');
		render(<Header />);
		expect(
			screen.getByRole('link', {
				name: 'Профиль пользователя',
			}),
		).toBeEnabled();
	});
});
