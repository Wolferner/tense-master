import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('zustand/react/shallow', () => ({
	useShallow: (fn: unknown) => fn,
}));

vi.mock('@/client/stores/settingsStore', () => ({
	useSettingsStore: vi.fn(),
}));

vi.mock('@/client/stores/sessionStore', () => ({
	useSessionStore: vi.fn(),
}));

import type { SessionStore } from '@/client/stores/sessionStore';
import { useSessionStore } from '@/client/stores/sessionStore';
import type { SettingsStore } from '@/client/stores/settingsStore';
import { useSettingsStore } from '@/client/stores/settingsStore';
import { Tense } from '@/domain/value-objects';
import { type ExerciseResponseDto } from '@/shared/dtos';
import messages from '@/shared/i18n/messages/ru.json';
import { NextIntlClientProvider } from 'next-intl';
import SelectTrainingSection from '../SelectTrainingSection';

function makeExercise(): ExerciseResponseDto {
	return {
		id: 'ex-1',
		tense: Tense.PRESENT_SIMPLE,
		question: 'test',
		answer: 'test',
		locale: 'ru',
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

const baseSettingsState: Partial<SettingsStore> = {
	selectedTenses: [Tense.PRESENT_SIMPLE],
	mode: 'fixed',
	fixedLimit: 10,
	toggleTense: mockActions.toggleTense,
	selectAll: mockActions.selectAll,
	clearAll: mockActions.clearAll,
	toggleGroup: mockActions.toggleGroup,
	updateMode: mockActions.updateMode,
};

const baseSessionState: Partial<SessionStore> = {
	exercises: [],
	isLoading: false,
	setStep: mockActions.setStep,
	startTraining: mockActions.startTraining,
};

function mockSettings(state: Partial<SettingsStore>) {
	vi.mocked(useSettingsStore).mockImplementation(
		<T,>(selector: (s: SettingsStore) => T): T => selector(state as SettingsStore),
	);
}

function mockSession(state: Partial<SessionStore>) {
	vi.mocked(useSessionStore).mockImplementation(
		<T,>(selector: (s: SessionStore) => T): T => selector(state as SessionStore),
	);
}

beforeEach(() => {
	vi.clearAllMocks();
	mockSettings(baseSettingsState);
	mockSession(baseSessionState);
});

describe('SelectTrainingSection', () => {
	it('shows "Начать" when there are no existing exercises', () => {
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<SelectTrainingSection />
			</NextIntlClientProvider>,
		);
		expect(screen.getByRole('button', { name: 'Начать' })).toBeInTheDocument();
	});

	it('shows "Начать заново" when exercises already exist', () => {
		mockSession({ ...baseSessionState, exercises: [makeExercise()] });
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<SelectTrainingSection />
			</NextIntlClientProvider>,
		);
		expect(screen.getByRole('button', { name: 'Начать заново' })).toBeInTheDocument();
	});

	it('"Начать" is disabled when no tenses are selected', () => {
		mockSettings({ ...baseSettingsState, selectedTenses: [] });
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<SelectTrainingSection />
			</NextIntlClientProvider>,
		);
		expect(screen.getByRole('button', { name: 'Начать' })).toBeDisabled();
	});

	it('"Начать" is enabled when tenses are selected', () => {
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<SelectTrainingSection />
			</NextIntlClientProvider>,
		);
		expect(screen.getByRole('button', { name: 'Начать' })).toBeEnabled();
	});

	it('shows "Продолжить" button when exercises exist', () => {
		mockSession({ ...baseSessionState, exercises: [makeExercise()] });
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<SelectTrainingSection />
			</NextIntlClientProvider>,
		);
		expect(screen.getByRole('button', { name: /Продолжить/ })).toBeInTheDocument();
	});

	it('does not show "Продолжить" button when no exercises exist', () => {
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<SelectTrainingSection />
			</NextIntlClientProvider>,
		);
		expect(screen.queryByRole('button', { name: /Продолжить/ })).not.toBeInTheDocument();
	});

	it('calls startTraining when "Начать" is clicked', async () => {
		const user = userEvent.setup();
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<SelectTrainingSection />
			</NextIntlClientProvider>,
		);
		await user.click(screen.getByRole('button', { name: 'Начать' }));
		expect(mockActions.startTraining).toHaveBeenCalledOnce();
	});

	it('calls selectAll when "Выбрать все" is clicked', async () => {
		const user = userEvent.setup();
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<SelectTrainingSection />
			</NextIntlClientProvider>,
		);
		await user.click(screen.getAllByRole('button', { name: 'Выбрать все' })[0]);
		expect(mockActions.selectAll).toHaveBeenCalledOnce();
	});

	it('calls clearAll when "Сбросить" is clicked', async () => {
		const user = userEvent.setup();
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<SelectTrainingSection />
			</NextIntlClientProvider>,
		);
		await user.click(screen.getByRole('button', { name: 'Сбросить' }));
		expect(mockActions.clearAll).toHaveBeenCalledOnce();
	});

	it('shows "Загрузка..." on the main button when isLoading', () => {
		mockSession({ ...baseSessionState, isLoading: true });
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<SelectTrainingSection />
			</NextIntlClientProvider>,
		);
		expect(screen.getByRole('button', { name: 'Загрузка...' })).toBeInTheDocument();
	});
});
