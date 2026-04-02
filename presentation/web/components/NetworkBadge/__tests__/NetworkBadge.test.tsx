import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/shared/hooks/useNetworkStatus', () => ({
	useNetworkStatus: vi.fn(),
}));

import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import NetworkBadge from '../NetworkBadge';

describe('NetworkBadge', () => {
	it('renders nothing when status is online', () => {
		vi.mocked(useNetworkStatus).mockReturnValue({ status: 'online' });
		const { container } = render(<NetworkBadge />);
		expect(container).toBeEmptyDOMElement();
	});

	it('shows "Offline" label when status is offline', () => {
		vi.mocked(useNetworkStatus).mockReturnValue({ status: 'offline' });
		render(<NetworkBadge />);
		expect(screen.getByText('Offline')).toBeInTheDocument();
	});

	it('shows "Slow connection" label when status is slow', () => {
		vi.mocked(useNetworkStatus).mockReturnValue({
			status: 'slow',
			type: '2g',
			rtt: 1000,
			downlink: 0.1,
		});
		render(<NetworkBadge />);
		expect(screen.getByText('Slow connection')).toBeInTheDocument();
	});
});
