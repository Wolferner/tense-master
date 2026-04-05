import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TenseBreakdown } from '../TenseBreakdown';

describe('TenseBreakdown', () => {
	it('shows empty placeholder when no stats', () => {
		render(<TenseBreakdown stats={[]} />);
		expect(screen.getByText('Нет данных')).toBeInTheDocument();
	});

	it('renders tense label and accuracy for each entry', () => {
		render(
			<TenseBreakdown
				stats={[
					{ tense: 'PRESENT_SIMPLE', total: 10, correct: 8, accuracy: 80 },
					{ tense: 'PAST_SIMPLE', total: 5, correct: 2, accuracy: 40 },
				]}
			/>,
		);
		expect(screen.getByText('Present Simple')).toBeInTheDocument();
		expect(screen.getByText('Past Simple')).toBeInTheDocument();
		expect(screen.getByText('80%')).toBeInTheDocument();
		expect(screen.getByText('40%')).toBeInTheDocument();
	});

	it('sets bar width to accuracy percent via inline style', () => {
		const { container } = render(
			<TenseBreakdown stats={[{ tense: 'PRESENT_SIMPLE', total: 10, correct: 6, accuracy: 60 }]} />,
		);
		const bar = container.querySelector<HTMLElement>('.bg-primary');
		expect(bar?.style.width).toBe('60%');
	});
});
