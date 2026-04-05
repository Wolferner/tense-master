import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/client/stores/sessionStore', () => ({
	useSessionStore: vi.fn(),
}));

vi.mock('../ui/SelectTrainingSection/SelectTrainingSection', () => ({
	default: () => <div data-testid='select-section' />,
}));

vi.mock('../ui/TrainingSection/TrainingSection', () => ({
	default: () => <div data-testid='training-section' />,
}));

import { useSessionStore } from '@/client/stores/sessionStore';
import type { SessionStore } from '@/client/stores/sessionStore';
import TenseTrainer from '../TenseTrainer';

describe('TenseTrainer', () => {
	it('renders SelectTrainingSection when step is "select"', () => {
		vi.mocked(useSessionStore).mockImplementation(
			<T,>(selector: (state: SessionStore) => T): T => selector({ step: 'select' } as SessionStore),
		);
		render(<TenseTrainer />);
		expect(screen.getByTestId('select-section')).toBeInTheDocument();
		expect(screen.queryByTestId('training-section')).not.toBeInTheDocument();
	});

	it('renders TrainingSection when step is "training"', () => {
		vi.mocked(useSessionStore).mockImplementation(
			<T,>(selector: (state: SessionStore) => T): T =>
				selector({ step: 'training' } as SessionStore),
		);
		render(<TenseTrainer />);
		expect(screen.getByTestId('training-section')).toBeInTheDocument();
		expect(screen.queryByTestId('select-section')).not.toBeInTheDocument();
	});
});
