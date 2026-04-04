import type { TenseStore } from '@/client/stores/useTenseStore';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('zustand/react/shallow', () => ({
	useShallow: (fn: unknown) => fn,
}));

vi.mock('@/shared/stores/useTenseStore', () => ({
	useTenseStore: vi.fn(),
	selectSelectSection: (s: TenseStore) => s,
}));

import { useTenseStore } from '@/client/stores/useTenseStore';
import { Tense } from '@/domain/value-objects';
import { type ExerciseResponseDto } from '@/server/aplication/exercise';
import SelectTrainingSection from '../SelectTrainingSection';

function makeExercise(): ExerciseResponseDto {
	return {
		id: 'ex-1',
		tense: Tense.PRESENT_SIMPLE,
		question: 'test',
		answer: 'test',
		explanation: 'test',
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}

const mockActions = {
	toggleTense: vi.fn(),
	selectAll: vi.fn(),
	clearAll: vi.fn(),
	toggleGroup: vi.fn(),
	updateMode: vi.fn(),
	setStep: vi.fn(),
	startTraining: vi.fn(),
};

const baseState = {
	selectedTenses: [Tense.PRESENT_SIMPLE],
	mode: 'fixed' as const,
	fixedLimit: 10,
	exercises: [] as ExerciseResponseDto[],
	isLoading: false,
	...mockActions,
};

beforeEach(() => {
	vi.clearAllMocks();
	vi.mocked(useTenseStore).mockImplementation(
		<T,>(selector: (state: TenseStore) => T): T => selector(baseState as unknown as TenseStore),
	);
});

describe('SelectTrainingSection', () => {
	it('shows "Начать" when there are no existing exercises', () => {
		render(<SelectTrainingSection />);
		expect(screen.getByRole('button', { name: 'Начать' })).toBeInTheDocument();
	});

	it('shows "Начать заново" when exercises already exist', () => {
		vi.mocked(useTenseStore).mockImplementation(
			<T,>(selector: (state: TenseStore) => T): T =>
				selector({ ...baseState, exercises: [makeExercise()] } as unknown as TenseStore),
		);
		render(<SelectTrainingSection />);
		expect(screen.getByRole('button', { name: 'Начать заново' })).toBeInTheDocument();
	});

	it('"Начать" is disabled when no tenses are selected', () => {
		vi.mocked(useTenseStore).mockImplementation(
			<T,>(selector: (state: TenseStore) => T): T =>
				selector({ ...baseState, selectedTenses: [] } as unknown as TenseStore),
		);
		render(<SelectTrainingSection />);
		expect(screen.getByRole('button', { name: 'Начать' })).toBeDisabled();
	});

	it('"Начать" is enabled when tenses are selected', () => {
		render(<SelectTrainingSection />);
		expect(screen.getByRole('button', { name: 'Начать' })).toBeEnabled();
	});

	it('shows "Продолжить" button when exercises exist', () => {
		vi.mocked(useTenseStore).mockImplementation(
			<T,>(selector: (state: TenseStore) => T): T =>
				selector({ ...baseState, exercises: [makeExercise()] } as unknown as TenseStore),
		);
		render(<SelectTrainingSection />);
		expect(screen.getByRole('button', { name: /Продолжить/ })).toBeInTheDocument();
	});

	it('does not show "Продолжить" button when no exercises exist', () => {
		render(<SelectTrainingSection />);
		expect(screen.queryByRole('button', { name: /Продолжить/ })).not.toBeInTheDocument();
	});

	it('calls startTraining when "Начать" is clicked', async () => {
		const user = userEvent.setup();
		render(<SelectTrainingSection />);
		await user.click(screen.getByRole('button', { name: 'Начать' }));
		expect(mockActions.startTraining).toHaveBeenCalledOnce();
	});

	it('calls selectAll when "Выбрать все" is clicked', async () => {
		const user = userEvent.setup();
		render(<SelectTrainingSection />);
		// The main "Выбрать все" button is first in DOM; TenseGroup toggles also use the same text
		await user.click(screen.getAllByRole('button', { name: 'Выбрать все' })[0]);
		expect(mockActions.selectAll).toHaveBeenCalledOnce();
	});

	it('calls clearAll when "Сбросить" is clicked', async () => {
		const user = userEvent.setup();
		render(<SelectTrainingSection />);
		await user.click(screen.getByRole('button', { name: 'Сбросить' }));
		expect(mockActions.clearAll).toHaveBeenCalledOnce();
	});

	it('shows "Загрузка..." on the main button when isLoading', () => {
		vi.mocked(useTenseStore).mockImplementation(
			<T,>(selector: (state: TenseStore) => T): T =>
				selector({ ...baseState, isLoading: true } as unknown as TenseStore),
		);
		render(<SelectTrainingSection />);
		expect(screen.getByRole('button', { name: 'Загрузка...' })).toBeInTheDocument();
	});
});
