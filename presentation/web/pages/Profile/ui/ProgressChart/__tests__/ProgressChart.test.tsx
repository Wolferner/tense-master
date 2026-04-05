import type { ChartDataPoint } from '@/client/application/services/ProfileService';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('recharts', () => ({
	ResponsiveContainer: () => null,
	AreaChart: () => null,
	Area: () => null,
	CartesianGrid: () => null,
	XAxis: () => null,
	YAxis: () => null,
	Tooltip: () => null,
}));

import { ProgressChart } from '../ProgressChart';

function makePoint(cumulative: number): ChartDataPoint {
	return { date: '1 янв', cumulative, sessionCorrect: cumulative, tenses: ['PRESENT_SIMPLE'] };
}

describe('ProgressChart', () => {
	it('shows placeholder when fewer than 2 data points', () => {
		render(<ProgressChart data={[makePoint(3)]} />);
		expect(screen.getByText(/минимум 2 сессии/)).toBeInTheDocument();
	});

	it('shows placeholder when all sessions have zero correct answers', () => {
		render(<ProgressChart data={[makePoint(0), makePoint(0)]} />);
		expect(screen.getByText(/минимум 2 сессии/)).toBeInTheDocument();
	});

	it('renders the chart when there are 2+ points with non-zero cumulative', () => {
		render(<ProgressChart data={[makePoint(3), makePoint(7)]} />);
		expect(screen.queryByText(/минимум 2 сессии/)).not.toBeInTheDocument();
	});
});
