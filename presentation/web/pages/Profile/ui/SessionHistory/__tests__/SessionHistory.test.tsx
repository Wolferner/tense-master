import type { SessionSummary } from '@/client/application/services/ProfileService';
import { Session } from '@/domain/entities/Session';
import messages from '@/shared/i18n/messages/ru.json';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import { SessionHistory } from '../SessionHistory';

function makeSummary(id: string, overrides: Partial<SessionSummary> = {}): SessionSummary {
	return {
		session: new Session(
			id,
			['PRESENT_SIMPLE'],
			'fixed',
			5,
			'completed',
			'2024-03-15T10:00:00.000Z',
		),
		total: 10,
		correct: 8,
		skipped: 0,
		accuracy: 80,
		...overrides,
	};
}

describe('SessionHistory', () => {
	it('shows empty placeholder when no sessions', () => {
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<SessionHistory summaries={[]} getSessionAnswers={() => []} />
			</NextIntlClientProvider>,
		);
		expect(screen.getByText('История пуста')).toBeInTheDocument();
	});

	it('renders a session card with accuracy and score', () => {
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<SessionHistory summaries={[makeSummary('s1')]} getSessionAnswers={() => []} />
			</NextIntlClientProvider>,
		);
		expect(screen.getByText('80%')).toBeInTheDocument();
		expect(screen.getByText('8/10 верно')).toBeInTheDocument();
	});

	it('expands session detail on click and calls getSessionAnswers with session id', async () => {
		const getSessionAnswers = vi.fn().mockReturnValue([]);
		const user = userEvent.setup();
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<SessionHistory summaries={[makeSummary('s1')]} getSessionAnswers={getSessionAnswers} />
			</NextIntlClientProvider>,
		);

		await user.click(screen.getByRole('button'));

		expect(getSessionAnswers).toHaveBeenCalledWith('s1');
		expect(screen.getByText('Нет ответов')).toBeInTheDocument();
	});

	it('collapses session detail on second click', async () => {
		const user = userEvent.setup();
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<SessionHistory summaries={[makeSummary('s1')]} getSessionAnswers={() => []} />
			</NextIntlClientProvider>,
		);
		const btn = screen.getByRole('button');

		await user.click(btn);
		expect(screen.getByText('Нет ответов')).toBeInTheDocument();

		await user.click(btn);
		expect(screen.queryByText('Нет ответов')).not.toBeInTheDocument();
	});

	it('only expands the clicked session when multiple exist', async () => {
		const user = userEvent.setup();
		const summaries = [makeSummary('s1'), makeSummary('s2')];
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<SessionHistory summaries={summaries} getSessionAnswers={() => []} />
			</NextIntlClientProvider>,
		);

		const buttons = screen.getAllByRole('button');
		await user.click(buttons[0]);

		// Only one "Нет ответов" should appear
		expect(screen.getAllByText('Нет ответов')).toHaveLength(1);
	});

	it('excludes skipped from the score denominator', () => {
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<SessionHistory
					summaries={[makeSummary('s1', { total: 10, correct: 6, skipped: 2, accuracy: 75 })]}
					getSessionAnswers={() => []}
				/>
			</NextIntlClientProvider>,
		);

		// denominator = total - skipped = 10 - 2 = 8
		expect(screen.getByText('6/8 верно')).toBeInTheDocument();
	});
});
