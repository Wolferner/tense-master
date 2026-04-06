import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/shared/config/routes';
import HomePage from '../Home';
import { REASONS } from '../logic/reasons';

describe('HomePage', () => {
	it('renders the main heading', () => {
		render(<HomePage />);
		expect(
			screen.getByRole('heading', { name: 'Практикуй английские времена офлайн' }),
		).toBeInTheDocument();
	});

	it('renders the CTA link pointing to /tense-trainer', () => {
		render(<HomePage />);
		const cta = screen.getByRole('link', { name: 'Начать тренировку по английским временам' });
		expect(cta).toBeInTheDocument();
		expect(cta).toHaveAttribute('href', ROUTES.trainer);
	});

	it('renders a card for every reason', () => {
		render(<HomePage />);
		for (const reason of REASONS) {
			expect(screen.getByText(reason.title)).toBeInTheDocument();
		}
	});

	it('renders the privacy section heading', () => {
		render(<HomePage />);
		expect(screen.getByRole('heading', { name: 'Ваши данные остаются у вас' })).toBeInTheDocument();
	});

	it('renders all three privacy points', () => {
		render(<HomePage />);
		expect(screen.getByText('Локальное хранилище')).toBeInTheDocument();
		expect(screen.getByText('Без слежки')).toBeInTheDocument();
		expect(screen.getByText('Работает офлайн')).toBeInTheDocument();
	});
});
