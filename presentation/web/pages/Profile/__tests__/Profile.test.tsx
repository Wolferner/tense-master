import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/presentation/web/pages/Profile/logic/useProfileData', () => ({
	useProfileData: vi.fn(),
}));

import { useProfileData } from '@/presentation/web/pages/Profile/logic/useProfileData';

const emptyStats = {
	overallStats: { total: 0, correct: 0, skipped: 0, accuracy: 0 },
	tenseStats: [],
	sessionSummaries: [],
	chartData: [],
	getSessionAnswers: () => [],
};

vi.mock('recharts', () => ({
	ResponsiveContainer: () => null,
	AreaChart: () => null,
	Area: () => null,
	CartesianGrid: () => null,
	XAxis: () => null,
	YAxis: () => null,
	Tooltip: () => null,
}));

describe('ProfilePage', async () => {
	const { default: ProfilePage } = await import('../Profile');

	it('shows loading spinner while data is loading', () => {
		vi.mocked(useProfileData).mockReturnValue({ ...emptyStats, isLoading: true });
		render(<ProfilePage />);
		expect(screen.getByText('Загрузка...')).toBeInTheDocument();
	});

	it('hides loading spinner and renders content when loaded', () => {
		vi.mocked(useProfileData).mockReturnValue({ ...emptyStats, isLoading: false });
		render(<ProfilePage />);
		expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument();
		expect(screen.getByText('Нет данных')).toBeInTheDocument(); // TenseBreakdown empty state
	});
});
