import type { TenseStore } from '@/shared/stores/useTenseStore';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/stores/useTenseStore', () => ({
	useTenseStore: vi.fn(),
	selectStep: (s: TenseStore) => s.step,
}));

vi.mock('../ui/SelectTrainingSection/SelectTrainingSection', () => ({
	default: () => <div data-testid='select-section' />,
}));

vi.mock('../ui/TrainingSection/TrainingSection', () => ({
	default: () => <div data-testid='training-section' />,
}));

import { useTenseStore } from '@/shared/stores/useTenseStore';
import TenseTrainer from '../TenseTrainer';

describe('TenseTrainer', () => {
	it('renders SelectTrainingSection when step is "select"', () => {
		vi.mocked(useTenseStore).mockImplementation(
			<T,>(selector: (state: TenseStore) => T): T => selector({ step: 'select' } as TenseStore),
		);
		render(<TenseTrainer />);
		expect(screen.getByTestId('select-section')).toBeInTheDocument();
		expect(screen.queryByTestId('training-section')).not.toBeInTheDocument();
	});

	it('renders TrainingSection when step is "training"', () => {
		vi.mocked(useTenseStore).mockImplementation(
			<T,>(selector: (state: TenseStore) => T): T => selector({ step: 'training' } as TenseStore),
		);
		render(<TenseTrainer />);
		expect(screen.getByTestId('training-section')).toBeInTheDocument();
		expect(screen.queryByTestId('select-section')).not.toBeInTheDocument();
	});
});
