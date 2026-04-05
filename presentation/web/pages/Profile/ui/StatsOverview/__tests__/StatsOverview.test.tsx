import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatsOverview } from '../StatsOverview';

describe('StatsOverview', () => {
	it('calculates wrong answers as total - correct - skipped', () => {
		render(<StatsOverview stats={{ total: 10, correct: 6, skipped: 2, accuracy: 75 }} />);
		// wrong = 10 - 6 - 2 = 2; skipped is also 2, so both cards show 2
		expect(screen.getAllByText('2')).toHaveLength(2);
	});

	it('shows accuracy with % suffix', () => {
		render(<StatsOverview stats={{ total: 10, correct: 8, skipped: 0, accuracy: 80 }} />);
		expect(screen.getByText('80%')).toBeInTheDocument();
	});
});
