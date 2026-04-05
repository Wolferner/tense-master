import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HomePage from '../Home';
import { REASONS } from '../logic/reason';

describe('HomePage', () => {
	it('renders the main heading', () => {
		render(<HomePage />);
		expect(screen.getByRole('heading', { name: 'Tense Master' })).toBeInTheDocument();
	});

	it('renders the CTA link pointing to /tense-trainer', () => {
		render(<HomePage />);
		const cta = screen.getByRole('link', { name: 'Начать тренировку по английским временам' });
		expect(cta).toBeInTheDocument();
		expect(cta).toHaveAttribute('href', '/tense-trainer');
	});

	it('renders a card for every reason', () => {
		render(<HomePage />);
		for (const reason of REASONS) {
			expect(screen.getByText(reason.title)).toBeInTheDocument();
		}
	});
});
