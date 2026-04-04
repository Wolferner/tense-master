import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('zustand/react/shallow', () => ({
	useShallow: (fn: unknown) => fn,
}));

vi.mock('@/client/stores/sessionStore', () => ({
	useSessionStore: vi.fn(),
}));

vi.mock('@/client/stores/settingsStore', () => ({
	useSettingsStore: vi.fn(),
}));

import type { SessionStore } from '@/client/stores/sessionStore';
import { useSessionStore } from '@/client/stores/sessionStore';
import type { SettingsStore } from '@/client/stores/settingsStore';
import { useSettingsStore } from '@/client/stores/settingsStore';
import { Tense } from '@/domain/value-objects';
import { type ExerciseResponseDto } from '@/shared/dtos';
import TrainingSection from '../TrainingSection';

const exercise: ExerciseResponseDto = {
	id: 'ex-1',
	tense: Tense.PRESENT_SIMPLE,
	question: 'Он читает книгу',
	answer: 'He reads a book',
	explanation: 'Present Simple for habits',
	createdAt: new Date(),
	updatedAt: new Date(),
};

const mockActions = {
	setStep: vi.fn(),
	nextExercise: vi.fn(),
	submitAnswer: vi.fn(),
};

const baseSessionState: Partial<SessionStore> = {
	sessionId: 'session-1',
	exercises: [exercise],
	currentExerciseIndex: 0,
	isLoading: false,
	answers: {},
	...mockActions,
};

const answeredSessionState: Partial<SessionStore> = {
	...baseSessionState,
	answers: {
		'ex-1': [
			{
				answer: 'He reads a book',
				skipped: false,
				isCorrect: true,
				createdAt: new Date().toISOString(),
				sessionId: 'session-1',
			},
		],
	},
};

function mockSession(state: Partial<SessionStore>) {
	vi.mocked(useSessionStore).mockImplementation(
		<T,>(selector: (s: SessionStore) => T): T => selector(state as SessionStore),
	);
}

const baseSettingsState: Partial<SettingsStore> = {
	mode: 'fixed',
	selectedTenses: [],
};

function mockSettings(state: Partial<SettingsStore>) {
	vi.mocked(useSettingsStore).mockImplementation(
		<T,>(selector: (s: SettingsStore) => T): T => selector(state as SettingsStore),
	);
}

beforeEach(() => {
	vi.clearAllMocks();
	mockSession(baseSessionState);
	mockSettings(baseSettingsState);
});

describe('TrainingSection', () => {
	it('renders the current question', () => {
		render(<TrainingSection />);
		expect(screen.getByText('Он читает книгу')).toBeInTheDocument();
	});

	it('shows an enabled textarea before answer is submitted', () => {
		render(<TrainingSection />);
		expect(screen.getByRole('textbox')).toBeEnabled();
	});

	it('shows "Skip" button when textarea is empty', () => {
		render(<TrainingSection />);
		expect(screen.getByRole('button', { name: 'Skip' })).toBeInTheDocument();
	});

	it('shows "Проверить" button when textarea has text', async () => {
		const user = userEvent.setup();
		render(<TrainingSection />);
		await user.type(screen.getByRole('textbox'), 'He reads');
		expect(screen.getByRole('button', { name: 'Проверить' })).toBeInTheDocument();
	});

	it('calls submitAnswer with current answer and exercise id when submit is clicked', async () => {
		const user = userEvent.setup();
		render(<TrainingSection />);
		await user.click(screen.getByRole('button', { name: 'Skip' }));
		expect(mockActions.submitAnswer).toHaveBeenCalledWith('', exercise.id);
	});

	it('disables textarea after answer is submitted', () => {
		mockSession(answeredSessionState);
		render(<TrainingSection />);
		expect(screen.getByRole('textbox')).toBeDisabled();
	});

	it('hides the submit button after answer is submitted', () => {
		mockSession(answeredSessionState);
		render(<TrainingSection />);
		expect(screen.queryByRole('button', { name: 'Skip' })).not.toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Проверить' })).not.toBeInTheDocument();
	});

	it('shows tense label badge after answer is submitted', () => {
		mockSession(answeredSessionState);
		render(<TrainingSection />);
		expect(screen.getByText('Present Simple')).toBeInTheDocument();
	});

	it('shows the explanation after submission', () => {
		mockSession(answeredSessionState);
		render(<TrainingSection />);
		expect(screen.getByText('Present Simple for habits')).toBeInTheDocument();
	});

	it('calls setStep("select") when back button is clicked', async () => {
		const user = userEvent.setup();
		render(<TrainingSection />);
		await user.click(screen.getByRole('button', { name: /Назад/ }));
		expect(mockActions.setStep).toHaveBeenCalledWith('select');
	});
});
